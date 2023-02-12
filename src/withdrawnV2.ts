import { ethers } from 'ethers'

import { tokenList } from "./constants/tokens"
import { R3vlClient } from './client'

export type FnArgs = {
  walletAddress?: string
  isERC20?: keyof typeof tokenList
}

/**
 *  V0
 */
export async function withdrawnFundsV2(this: R3vlClient, payload?: FnArgs) {
  const { revPathV2Read, _chainId } = this

  if (!revPathV2Read) throw new Error("ERROR:")

  const { walletAddress, isERC20 } = payload || { walletAddress: undefined, isERC20: undefined }

  try {
    const released = walletAddress ? await revPathV2Read.getTokenWithdrawn(
      isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero,
      walletAddress
    ) : await revPathV2Read.getTotalTokenReleased(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)

    return parseFloat(ethers.utils.formatEther(released))
  } catch (error) {
    console.error(error)
  }
}
