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
export async function withdrawFundsV2(this: R3vlClient, { walletAddress, isERC20 }: FnArgs) {
  const { revPathV2Write, _chainId } = this

  if (!revPathV2Write) return false

  try {
    const tx = isERC20 ?
      await revPathV2Write.release(tokenList[isERC20][_chainId], walletAddress) :
      await revPathV2Write.release(ethers.constants.AddressZero, walletAddress)
    const result = await tx?.wait()
    const [event] = result?.events || [{ args: [] }]

    return event?.args && ethers.utils.formatEther(event?.args[1])
  } catch (error) {
    console.error(error)
  }
}
