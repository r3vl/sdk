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
export async function withdrawnV0(this: R3vlClient, payload?: FnArgs) {
  const { revPathV0Read, _chainId } = this

  if (!revPathV0Read) throw new Error("ERROR:")

  const { walletAddress, isERC20 } = payload || { walletAddress: undefined, isERC20: undefined }

  if (!walletAddress) return undefined // TODO: implement final solution for total balance

  try {
    if (isERC20) {
      const released = await revPathV0Read['released(address,address)'](tokenList[isERC20][_chainId], walletAddress)

      return parseFloat(ethers.utils.formatEther(released))
    }

    const released = await revPathV0Read['released(address)'](walletAddress)

    return parseFloat(ethers.utils.formatEther(released))
  } catch (error) {
    console.error(error)
  }
}
