import { ethers } from 'ethers'

import { tokenList } from "./constants/tokens"
import { R3vlClient } from './client'

export type FnArgs = {
  walletAddress?: string
  isERC20?: keyof typeof tokenList
}

/**
 *  V1
 */
export async function withdrawableV1(this: R3vlClient, payload?: FnArgs) {
  const { revPathV1Read, sdk, _chainId } = this

  if (!revPathV1Read || !sdk) throw new Error("ERROR:")

  const { walletAddress, isERC20 } = payload || { walletAddress: undefined, isERC20: undefined }

  if (!walletAddress) return [0, undefined] // TODO: implement final solution for total balance

  try {
    if (isERC20) {
      const pendingBalance = await revPathV1Read.erc20Withdrawable(tokenList[isERC20][_chainId], walletAddress)

      return [0, parseFloat(ethers.utils.formatEther(pendingBalance))]
    }

    const pendingBalance = await revPathV1Read.getPendingEthBalance(walletAddress)

    return [0, parseFloat(ethers.utils.formatEther(pendingBalance))]
  } catch (error) {
    console.error(error)
  }
}
