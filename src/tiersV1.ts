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
  const { revPathV1Read } = this
  walletAddress; // unused

  if (!revPathV1Read) return

  try {
    const tiersNumber = await revPathV1Read.getTotalRevenueTiers()
    const currentTier = await revPathV1Read.getCurrentTier()
    const tiers = []

    for (let i = 0; i < tiersNumber?.toNumber(); i++) {
      const [limitAmount, walletList] = await revPathV1Read.getRevenueTier(i)
      const distributedAmount = await revPathV1Read.getTierDistributedAmount(i)

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
