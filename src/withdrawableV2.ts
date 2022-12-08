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
export async function withdrawableV2(this: R3vlClient, { walletAddress, isERC20 }: FnArgs) {
  const { revPathV2, sdk, _chainId } = this

  if (!revPathV2 || !sdk) return false

  try {
    const pendingBalance = await revPathV2.getWithdrawableToken(
      isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero,
      walletAddress
    )

    return parseFloat(ethers.utils.formatEther(pendingBalance))
  } catch (error) {
    console.error(error)
  }
}
