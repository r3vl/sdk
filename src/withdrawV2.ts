import { ethers } from 'ethers'

import { tokenList } from "./constants/tokens"
import { R3vlClient } from './client'

export type FnArgs = {
  walletAddress: string
  isERC20?: keyof typeof tokenList
}

/**
 *  V2
 */
export async function withdrawFundsV2(this: R3vlClient, { walletAddress, isERC20 }: FnArgs) {
  const { revPathV2Write, _chainId } = this

  if (!revPathV2Write) return false

  try {
    let tx 

    if (walletAddress) {
      tx = isERC20 ?
        await revPathV2Write.release(tokenList[isERC20][_chainId], walletAddress) :
        await revPathV2Write.release(ethers.constants.AddressZero, walletAddress)
    } else {
      tx = await revPathV2Write.distributePendingTokens(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)
    }

    const result = await tx?.wait()
    const [event] = result?.events || [{ args: [] }]

    return event?.args && ethers.utils.formatEther(event?.args[1])
  } catch (error) {
    console.error(error)
  }
}
