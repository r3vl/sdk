import { ethers } from 'ethers'

import { PathLibraryV1__factory } from './typechain'
import { tokenList } from "./constants/tokens"
import { communityProvider, getChainId } from './utils'

type TierType = {
  limitAmount: number
  walletList: string[]
  isCurrentTier: boolean
  distributedAmount: number
}

/**
 *  V0
 */
export const tiersV1 = async (revPathAddress: string, walletAddress: string, isERC20?: keyof typeof tokenList): Promise<TierType[]> => {
  const provider = communityProvider()
  const chainId = await getChainId()

  try {
    const revPath = PathLibraryV1__factory.connect(revPathAddress, provider)

    const tiersNumber = await revPath.getTotalRevenueTiers()
    const currentTier = await revPath.getCurrentTier()
    const tiers = []

    for (let i = 0; i < tiersNumber?.toNumber(); i++) {
      const [limitAmount, walletList] = await revPath.getRevenueTier(i)
      const distributedAmount = await revPath.getTierDistributedAmount(i)

      tiers.push({
        limitAmount: parseFloat(ethers.utils.formatEther(limitAmount)),
        walletList,
        isCurrentTier: i === currentTier?.toNumber(),
        distributedAmount: parseFloat(ethers.utils.formatEther(distributedAmount))
      })
    }

    console.log(tiers)

    return tiers
  } catch (error) {
    console.error(error)

    return []
  }
}
