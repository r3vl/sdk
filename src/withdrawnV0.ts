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
export async function withdrawnV0(this: R3vlClient, { walletAddress, isERC20 }: FnArgs) {
  const { revPathV0Write, _chainId } = this

  if (!revPathV0Write) return false

  try {
    if (isERC20) {
      const released = await revPathV0Write['released(address,address)'](tokenList[isERC20][_chainId], walletAddress)

      return parseFloat(ethers.utils.formatEther(released))
    }

    const released = await revPathV0Write['released(address)'](walletAddress)

    return parseFloat(ethers.utils.formatEther(released))
  } catch (error) {
    console.error(error)
  }
}
