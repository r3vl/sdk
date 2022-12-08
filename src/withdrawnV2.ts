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
export async function withdrawnFundsV2(this: R3vlClient, { walletAddress, isERC20 }: FnArgs) {
  const { revPathV2, _chainId } = this

  if (!revPathV2) return false

  try {
    const released = await revPathV2.getTokenWithdrawn(
      isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero,
      walletAddress
    )

    return parseFloat(ethers.utils.formatEther(released))
  } catch (error) {
    console.error(error)
  }
}
