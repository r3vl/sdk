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
export async function withdrawFundsV0(this: R3vlClient, { walletAddress, isERC20 }: FnArgs) {
  const { revPathV0, _chainId } = this

  if (!revPathV0) return false

  try {
    const tx = isERC20 ?
      await revPathV0['release(address,address)'](tokenList[isERC20][_chainId], walletAddress) :
      await revPathV0['release(address)'](walletAddress)
    const result = await tx?.wait()
    const [event] = result?.events || [{ args: [] }]

    return event?.args && ethers.utils.formatEther(event?.args[1])
  } catch (error) {
    console.error(error)
  }
}
