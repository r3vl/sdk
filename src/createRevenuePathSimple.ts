import { BigNumberish, ethers, utils } from 'ethers'
import { chainIds, tokenList } from './constants/tokens'
import { GaslessOpts, GeneralOpts, R3vlClient } from './client'

export type FnArgs = {
  walletList: string[][],
  distribution: number[][], 
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
export async function createRevenuePathSimple(
  this: R3vlClient, 
  { 
    walletList, 
    distribution,  
    name, 
    mutabilityDisabled 
  } : FnArgs,
  opts?: GeneralOpts & GaslessOpts
) {
  const { sdk, _chainId, relay, apiSigner } = this

  const reveelMainSimple = (sdk as any).reveelMainSimple || null

  if (!sdk || !reveelMainSimple) return

  const contract = reveelMainSimple;

  const formatedDistribution = distribution.map(item => {
    return item.map(el => {
     return Number(ethers.utils.parseUnits(el.toString(), 5).toString())
    })
 })

  try {
    console.log("CREATE_SIMPLE_REVENUE_PATH_PAYLOAD",
      walletList,
      formatedDistribution, 
      name,
      !!opts?.isGasLess,
      mutabilityDisabled
    )

    const storeDB = async (result: any, customToken: string) => {
      const newRevPathAddress = result?.logs[0].address

      const payload = {
        address: newRevPathAddress,
        name,
        blockNumber: result.blockNumber,
        metadata: JSON.stringify({ 
          walletList, 
          distribution, 
          name, 
          mutabilityDisabled 
        }),
      }

      await apiSigner?.signCreateRevenuePath({
        address: newRevPathAddress,
        name,
        walletList,
        distribution,
        fBPayload: payload,
        isSimple: true
      }, customToken)
    }

    if (opts?.isGasLess && relay?.signatureCall) {
      const { data } = await contract.populateTransaction.createRevenuePath(
        walletList[0],
        formatedDistribution[0], 
        name,
        !!opts?.isGasLess,
        mutabilityDisabled
      )
        
      const request = {
        chainId: _chainId,
        target: contract.address,
        data: data as any
      };

      const { customToken } = await apiSigner?.authWallet() || { customToken: "" }

      // send relayRequest to Gelato Relay API
      const tx = await relay?.signatureCall(request, opts.gasLessKey)

      const result = await tx.wait()

      await storeDB(result, customToken)

      return result
    }

    const estimateGas = await contract.estimateGas.createRevenuePath(
      walletList[0],
      formatedDistribution[0], 
      name,
      !!opts?.isGasLess,
      mutabilityDisabled
    )

    const { customToken } = await apiSigner?.authWallet() || { customToken: "" }
    
    const tx = await contract.createRevenuePath(
      walletList[0],
      formatedDistribution[0],
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
    console.error(error, 'createRevenuePathSimple Error')

    const pathLibraryContract = 'pathLibrarySimple' in sdk ? sdk.pathLibrarySimple : undefined;

    if (pathLibraryContract) {
      const errorData = error?.error?.data?.originalError?.data;

      if (errorData) {
        throw pathLibraryContract.interface.parseError(errorData);
      }
    }

    throw error
  }
}
