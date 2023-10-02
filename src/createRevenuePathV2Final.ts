import { BigNumberish, ethers } from 'ethers'
import { chainIds, tokenList } from './constants/tokens'
import { GaslessOpts, GeneralOpts, R3vlClient } from './client'
import { createRevenuePathSimple, FnArgs as SimpleArgs } from './createRevenuePathSimple'

export type FnArgs = {
  walletList: string[][],
  distribution: number[][], 
  tiers?: { [token: string]: string }[],
  name: string,
  mutabilityDisabled: boolean
}

export const increaseGasLimit = (
  estimatedGasLimit: ethers.BigNumberish,
  chainId?: number
) => {
  return BigInt(estimatedGasLimit) * BigInt(chainId === chainIds.mainnet ? 100 : 130) / BigInt(100)
}

/**
 *  V2
 */
export async function createRevenuePathV2Final(
  this: R3vlClient, 
  { 
    walletList, 
    distribution, 
    tiers, 
    name, 
    mutabilityDisabled 
  } : FnArgs,
  opts?: GeneralOpts & GaslessOpts
) {
  if (walletList.length === 1) return await createRevenuePathSimple.call(this, { 
    walletList,
    distribution,
    name,
    mutabilityDisabled
  } as unknown as SimpleArgs, opts)

  const { sdk, _chainId, relay, apiSigner } = this

  if (!sdk) return

  const contract = sdk.reveelMainV2Final;

  const formatedLimits: BigNumberish[][] = (tiers?.length && tiers?.length > 0) ? Object.keys(tiers[0]).reduce((acc: BigNumberish[][], key) => {
    acc.push(
      tiers.map((item) => {
        return key === "eth" || key === "matic"
          ? ethers.parseEther(item[key])
          : key === "dai"
          ? ethers.parseUnits(item[key], 18)
          : ethers.parseUnits(item[key])
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
      return Number(ethers.parseUnits(el.toString(), 5).toString())
     })
  })

  try {
    console.log("CREATE_REVENUE_PATH_PAYLOAD",
      walletList,
      formatedDistribution, 
      formatedTokens,
      formatedLimits,
      name,
      !!opts?.isGasLess,
      mutabilityDisabled
    )
    const storeDB = async (result: any, customToken: string, isGasLess?: boolean) => {

      const newRevPathAddress = result?.logs[0].address

      const payload = {
        address: newRevPathAddress,
        name,
        blockNumber: result.blockNumber,
        metadata: JSON.stringify({ 
          walletList, 
          distribution, 
          tiers, 
          name, 
          mutabilityDisabled,
          isGasLess
        }),
      }

      await apiSigner?.signCreateRevenuePath({
        address: newRevPathAddress,
        name,
        walletList,
        distribution,
        limits: tiers,
        fBPayload: payload
      }, customToken)
    }

    if (opts?.isGasLess && relay?.signatureCall) {
      const { data } = await contract.populateTransaction.createRevenuePath(
        walletList,
        formatedDistribution, 
        formatedTokens,
        formatedLimits,
        name,
        !!opts?.isGasLess,
        mutabilityDisabled
      )

      const request = {
        chainId: _chainId,
        target: contract.target,
        data: data as any
      };

      const { customToken } = await apiSigner?.authWallet() || { customToken: "" }

      // send relayRequest to Gelato Relay API
      const tx = await relay?.signatureCall(request, opts.gasLessKey)

      const result = await tx.wait()

      await storeDB(result, customToken, true)

      return result
    }

    const estimateGas = await contract.estimateGas.createRevenuePath(
      walletList,
      formatedDistribution, 
      formatedTokens,
      formatedLimits,
      name,
      !!opts?.isGasLess,
      mutabilityDisabled
    )

    const { customToken } = await apiSigner?.authWallet() || { customToken: "" }
    
    const tx = await contract.createRevenuePath(
      walletList,
      formatedDistribution, 
      formatedTokens,
      formatedLimits,
      name,
      !!opts?.isGasLess,
      mutabilityDisabled,
      {
        gasLimit: opts?.customGasLimit || increaseGasLimit(estimateGas, _chainId),
      }
    )

    const result = await tx.wait()

    await storeDB(result, customToken)

    return result
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
