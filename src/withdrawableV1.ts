import { ethers } from 'ethers'

import { tokenList } from "./constants/tokens"
import { R3vlClient } from './client'

export type FnArgs = {
  walletAddress: string
  ERC20Address?: keyof typeof tokenList
}

/**
 *  V1
 */
export async function withdrawableV1(this: R3vlClient, { walletAddress, ERC20Address }: FnArgs) {
  const { revPathV1Write, sdk, _chainId } = this

  if (!revPathV1Write || !sdk) return false

  try {
    if (ERC20Address) {
      const pendingBalance = await revPathV1Write.erc20Withdrawable(tokenList[ERC20Address][_chainId], walletAddress)

      return parseFloat(ethers.utils.formatEther(pendingBalance))
    }

    const pendingBalance = await revPathV1Write.getPendingEthBalance(walletAddress)

    return parseFloat(ethers.utils.formatEther(pendingBalance))
  } catch (error) {
    console.error(error)
  }
}
