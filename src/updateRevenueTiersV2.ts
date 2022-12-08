import { ethers } from 'ethers'
import { R3vlClient } from './client'

export type FnArgs = {
  walletList: string[][],
  distribution: number[][], 
  tierNumbers: number[],
}

/**
 *  V2
 */
export async function updateRevenueTiersV2 (
  this: R3vlClient, 
  {
    walletList,
    distribution,
    tierNumbers
  } : FnArgs
) {
  const { revPathV2, sdk } = this

  if (!revPathV2 || !sdk) return false

  const formatedDistribution = distribution.map(item => {
     return item.map(el => {
      return Number(ethers.utils.parseUnits(el.toString(), 5).toString())
     })
  }) 

  try {
    const tx = await revPathV2.updateRevenueTiers(
      walletList,
      formatedDistribution, 
      tierNumbers,
      {
        gasLimit: 900000,
      }
    )

    const result = await tx?.wait()

    console.log(result, 'updateRevenueTiersV2 Result');
    
    return result
  } catch (error) {
    console.error(error, 'updateRevenueTiersV2 Error')
  }
}

