import { ethers } from 'ethers'

import { PathLibraryV1__factory } from './typechain'
import { tokenList } from "./constants/tokens"
import { communityProvider, getChainId } from './utils'

/**
 *  V0
 */
export const withdrawnV1 = async (revPathAddress: string, walletAddress: string, isERC20?: 'weth') => {
  const provider = communityProvider()
  const chainId = await getChainId()

  try {
    const revPath = PathLibraryV1__factory.connect(revPathAddress, provider)

    if (isERC20) {
      const released = await revPath.getERC20Released(tokenList[isERC20][chainId], walletAddress)

      return parseFloat(ethers.utils.formatEther(released))
    }

    const released = await revPath.getEthWithdrawn(walletAddress)

    return parseFloat(ethers.utils.formatEther(released))
  } catch (error) {
    console.error(error)
  }
}
