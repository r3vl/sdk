import { ethers } from 'ethers'

import { PathLibraryV0__factory } from './typechain'
import { tokenList } from "./constants/tokens"
import { communityProvider } from './utils'

/**
 *  V0
 */
export const withdrawnV0 = async (revPathAddress: string, walletAddress: string, isERC20?: 'weth') => {
  const provider = communityProvider()
  const { chainId } = await provider.getNetwork()

  try {
    const revPath = PathLibraryV0__factory.connect(revPathAddress, provider)

    if (isERC20) {
      const released = await revPath['released(address,address)'](tokenList[isERC20][chainId], walletAddress)

      return parseFloat(ethers.utils.formatEther(released))
    }

    const released = await revPath['released(address)'](walletAddress)

    return parseFloat(ethers.utils.formatEther(released))
  } catch (error) {
    console.error(error)
  }
}
