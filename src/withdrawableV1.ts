import { ethers } from 'ethers'

import { PathLibraryV1__factory } from './typechain'
import { tokenList } from "./constants/tokens"
import { communityProvider, getChainId } from './utils'

/**
 *  V1
 */
export const withdrawableV1 = async (revPathAddress: string, walletAddress: string, isERC20?: keyof typeof tokenList) => {
  const provider = communityProvider()
  const chainId = await getChainId()

  try {
    const revPath = PathLibraryV1__factory.connect(revPathAddress, provider)

    if (isERC20) {
      const pendingBalance = await revPath.erc20Withdrawable(tokenList[isERC20][chainId], walletAddress)

      return parseFloat(ethers.utils.formatEther(pendingBalance))
    }

    const pendingBalance = await revPath.getPendingEthBalance(walletAddress)

    return parseFloat(ethers.utils.formatEther(pendingBalance))
  } catch (error) {
    console.error(error)
  }
}
