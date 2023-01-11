import { ethers } from 'ethers'
import { R3vlClient } from './client'

export type UpdateRevenueTierV1Args = {
  walletList: string[],
  distribution: number[], 
  tierLimit: number,
  tierNumber: number,
}

/**
 *  V1
 */
export async function updateRevenueTierV1 (
  this: R3vlClient, 
  { 
    walletList,
    distribution,
    tierLimit,
    tierNumber
  } : UpdateRevenueTierV1Args
) {
  const { revPathV1Write, sdk } = this

  if (!revPathV1Write || !sdk) return

  const formatedTierLimit = ethers.utils.parseEther(tierLimit.toString())
  const formatedDistribution = distribution.map(item => Number(ethers.utils.parseUnits(item.toString(), 5).toString()))

  try {
    const tx = await revPathV1Write.updateRevenueTier(
      walletList,
      formatedDistribution, 
      formatedTierLimit,
      tierNumber,
      {
        gasLimit: 900000,
      }
    )

    const result = await tx?.wait()

    console.log(result, 'updateRevenueTierV1 Result');

    return result

  } catch (error) {
    console.error(error, 'updateRevenueTierV1 Error')
  }
}