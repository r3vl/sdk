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
export async function withdrawnV1(this: R3vlClient, payload?: FnArgs, _getBN?: boolean) {
  const { revPathV1Read, _chainId } = this

  if (!revPathV1Read) throw new Error("ERROR:")

  const { walletAddress, isERC20 } = payload || { walletAddress: undefined, isERC20: undefined }

  if (!walletAddress) return undefined // TODO: implement final solution for total balance

  try {
    if (isERC20) {
      const released = await revPathV1Read.getERC20Released(tokenList[isERC20][_chainId], walletAddress)

      return parseFloat(ethers.utils.formatEther(released))
    }

    const released = await revPathV1Read.getEthWithdrawn(walletAddress)

    return parseFloat(ethers.utils.formatEther(released))
  } catch (error) {
    console.error(error)
  }
}
