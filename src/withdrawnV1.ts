import { ethers } from 'ethers'

import { tokenList } from "./constants/tokens"
import { R3vlClient } from './client'

export type FnArgs = {
  walletAddress: string
  isERC20?: keyof typeof tokenList
}

/**
 *  V0
 */
export async function withdrawnV1(this: R3vlClient, { walletAddress, isERC20 }: FnArgs) {
  const { revPathV1, _chainId } = this

  if (!revPathV1) return false

  try {
    if (isERC20) {
      const released = await revPathV1.getERC20Released(tokenList[isERC20][_chainId], walletAddress)

      return parseFloat(ethers.utils.formatEther(released))
    }

    const released = await revPathV1.getEthWithdrawn(walletAddress)

    return parseFloat(ethers.utils.formatEther(released))
  } catch (error) {
    console.error(error)
  }
}
