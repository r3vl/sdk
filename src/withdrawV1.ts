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
export async function withdrawFundsV1(this: R3vlClient, { walletAddress, ERC20Address }: FnArgs) {
  const { revPathV1, _chainId } = this

  if (!revPathV1) return false
  
  try {
    const tx = ERC20Address ?
      await revPathV1.releaseERC20(tokenList[ERC20Address][_chainId], walletAddress) :
      await revPathV1.release(walletAddress)
    const result = await tx?.wait()
    const [event] = result?.events || [{ args: [] }]

    return event?.args && ethers.utils.formatEther(event?.args[1])
  } catch (error) {
    console.error(error)
  }
}
