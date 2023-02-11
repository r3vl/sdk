import { ethers } from 'ethers'
import { R3vlClient } from './client'

export type FnArgs = {
  walletList: string[][],
  distribution: number[][], 
  tierLimits: number[],
  name: string,
  mutabilityEnabled: boolean
}

/**
 *  V1
 */
export async function createRevenuePathV1 (
  this: R3vlClient, 
  { 
    walletList, 
    distribution, 
    tierLimits, 
    name, 
    mutabilityEnabled 
  } : FnArgs,
  opts?: {
    customGasLimit?: number
  }
) {
  const { sdk } = this

  if (!sdk) return

  const contract = sdk.reveelMainV1;

  const formatedTierLimits = tierLimits.map(limit => ethers.utils.parseEther(limit.toString()).toString())

  const formatedDistribution = distribution.map(item => {
     return item.map(el => {
      return Number(ethers.utils.parseUnits(el.toString(), 5).toString())
     })
  }) 

  try {
    const tx = await contract.createRevenuePath(
      walletList,
      formatedDistribution, 
      formatedTierLimits,
      name,
      mutabilityEnabled,
      {
        gasLimit: opts?.customGasLimit,
      }
    )

    const result = await tx?.wait()

    console.log(result, 'createRevenuePathV1 Result');
    
    return result
  } catch (error) {
    console.error(error, 'createRevenuePathV1 Error')

    throw error
  }
}
