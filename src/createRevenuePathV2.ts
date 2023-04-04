import { BigNumberish, constants, errors, ethers, utils } from 'ethers'
import { chainIds, tokenList } from './constants/tokens'
import { R3vlClient } from './client'

export type FnArgs = {
  walletList: string[][],
  distribution: number[][], 
  tiers?: { [token: string]: string }[],
  name: string,
  mutabilityDisabled: boolean
}

export const increaseGasLimit = (
  estimatedGasLimit: ethers.BigNumber,
  chainId?: number
) => {
  return estimatedGasLimit.mul(chainId === chainIds.mainnet ? 100 : 130).div(100)
}

/**
 *  V2
 */
export async function createRevenuePathV2(
  this: R3vlClient, 
  { 
    walletList, 
    distribution, 
    tiers, 
    name, 
    mutabilityDisabled 
  } : FnArgs,
  opts?: {
    customGasLimit?: number
    isGasLess?: boolean
    gasLessKey?: string
  }
) {
  const { sdk, _chainId, relay } = this

  if (!sdk) return

  const contract = sdk.reveelMainV2;

  const formatedLimits: BigNumberish[][] = (tiers?.length && tiers?.length > 0) ? Object.keys(tiers[0]).reduce((acc: BigNumberish[][], key) => {
    acc.push(
      tiers.map((item) => {
        return key === "eth" || key === "matic"
          ? utils.parseEther(item[key])
          : key === "dai"
          ? utils.parseUnits(item[key], 18)
          : utils.parseUnits(item[key])
      }),
    )
    return acc
  }, []) : []

  const formatedTokens: string[]= []

  const tokens = tiers?.length && tiers?.length > 0 ? Object.keys(tiers[0]) : []

  tokens.map((token) => {
    const tokenConfig = tokenList[token.toLowerCase() as keyof typeof tokenList]

    if (tokenConfig && tokenConfig[_chainId]) formatedTokens.push(tokenConfig[_chainId])
  })

  const formatedDistribution = distribution.map(item => {
     return item.map(el => {
      return Number(ethers.utils.parseUnits(el.toString(), 5).toString())
     })
  })

  try {
    console.log("CREATE_REVENUE_PATH_PAYLOAD",
      walletList,
      formatedDistribution, 
      formatedTokens,
      formatedLimits,
      name,
      mutabilityDisabled
    )

    if (opts?.isGasLess && relay?.signatureCall) {
      const { data } = await contract.populateTransaction.createRevenuePath(
        walletList,
        formatedDistribution, 
        formatedTokens,
        formatedLimits,
        name,
        mutabilityDisabled
        )
        
        const request = {
          chainId: _chainId,
          target: contract.address,
          data: data as any
        };
        
        // send relayRequest to Gelato Relay API
        const relayResponse = await relay?.signatureCall(request, opts.gasLessKey)

        return relayResponse
      }

      const estimateGas = await contract.estimateGas.createRevenuePath(
        walletList,
        formatedDistribution, 
        formatedTokens,
        formatedLimits,
        name,
        mutabilityDisabled
      )
      
      const tx = await contract.createRevenuePath(
        walletList,
        formatedDistribution, 
        formatedTokens,
        formatedLimits,
        name,
        mutabilityDisabled,
        {
          gasLimit: opts?.customGasLimit || increaseGasLimit(estimateGas, _chainId),
        }
        )
        
        // const result = await tx?.wait()
        
        // console.log(result, 'createRevenuePathV2 Result');
        
        return tx
      } catch (error: any) {
        console.error(error, 'createRevenuePathV2 Error')

    const pathLibraryContract = 'pathLibraryV2' in sdk ? sdk.pathLibraryV2 : undefined;

    if (pathLibraryContract) {
      const errorData = error?.error?.data?.originalError?.data;

      if (errorData) {
        throw pathLibraryContract.interface.parseError(errorData);
      }
    }
    throw error
  }
}
