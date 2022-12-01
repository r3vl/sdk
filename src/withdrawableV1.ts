import { ethers } from 'ethers'

import { tokenList } from "./constants/tokens"
import { R3vlClient } from './client'

export type FnArgs = {
  walletAddress: string
  isERC20?: keyof typeof tokenList
}

/**
 *  V1
 */
export async function withdrawableV1(this: R3vlClient, { walletAddress, isERC20 }: FnArgs) {
  const { revPathV1, sdk, _chainId } = this

  if (!revPathV1 || !sdk) return false

  try {
    if (isERC20) {
      const pendingBalance = await revPathV1.erc20Withdrawable(tokenList[isERC20][_chainId], walletAddress)

      return parseFloat(ethers.utils.formatEther(pendingBalance))
    }

    const pendingBalance = await revPathV1.getPendingEthBalance(walletAddress)

    return parseFloat(ethers.utils.formatEther(pendingBalance))
  } catch (error) {
    console.error(error)
  }
}
