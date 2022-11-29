import { ethers } from 'ethers'

import { PathLibraryV1__factory } from './typechain'
import { tokenList } from "./constants/tokens"
import { communityProvider, getChainId } from './utils'

/**
 *  V0
 */
export const tierV1 = async (revPathAddress: string, walletAddress: string, isERC20?: keyof typeof tokenList) => {
  const provider = communityProvider()
  const chainId = await getChainId()

  try {
    const revPath = PathLibraryV1__factory.connect(revPathAddress, provider)

    const tiersNumber = await revPath.getTotalRevenueTiers()
    const currentTier = await revPath.getCurrentTier()
    const tiers = []

    for (let i = 0; i < tiersNumber?.toNumber(); i++) {
      const [limitAmount, walletList] = await revPath.getRevenueTier(i)

      tiers.push({
        limitAmount: parseFloat(ethers.utils.formatEther(limitAmount)),
        walletList,
        isCurrentTier: i === currentTier?.toNumber()
      })
    }

    console.log(tiers)
  } catch (error) {
    console.error(error)
  }
}
