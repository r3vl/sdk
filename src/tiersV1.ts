import { ethers } from 'ethers'

import { R3vlClient } from './client'

export type FnArgs = {
  walletAddress?: string
}

export type TierType = {
  limitAmount: number
  walletList: string[]
  isCurrentTier: boolean
  distributedAmount: number
}

/**
 *  V0
 */
export async function tiersV1(this: R3vlClient, { walletAddress }: FnArgs): Promise<TierType[] | undefined> {
  const { revPathV1 } = this
  walletAddress; // unused
  if (!revPathV1) return

  try {
    const tiersNumber = await revPathV1.getTotalRevenueTiers()
    const currentTier = await revPathV1.getCurrentTier()
    const tiers = []

    for (let i = 0; i < tiersNumber?.toNumber(); i++) {
      const [limitAmount, walletList] = await revPathV1.getRevenueTier(i)
      const distributedAmount = await revPathV1.getTierDistributedAmount(i)

      tiers.push({
        limitAmount: parseFloat(ethers.utils.formatEther(limitAmount)),
        walletList,
        isCurrentTier: i === currentTier?.toNumber(),
        distributedAmount: parseFloat(ethers.utils.formatEther(distributedAmount))
      })
    }

    return tiers
  } catch (error) {
    console.error(error)
  }
}
