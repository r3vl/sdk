import { ethers } from 'ethers'

import { tokenList } from "./constants/tokens"
import { R3vlClient } from './client'

export type FnArgs = {
  walletAddress: string
  ERC20Address?: keyof typeof tokenList
}

/**
 *  V0
 */
export async function withdrawnV1(this: R3vlClient, { walletAddress, ERC20Address }: FnArgs) {
  const { revPathV1, _chainId } = this

  if (!revPathV1) return false

  try {
    if (ERC20Address) {
      const released = await revPathV1.getERC20Released(tokenList[ERC20Address][_chainId], walletAddress)

      return parseFloat(ethers.utils.formatEther(released))
    }

    const released = await revPathV1.getEthWithdrawn(walletAddress)

    return parseFloat(ethers.utils.formatEther(released))
  } catch (error) {
    console.error(error)
  }
}
