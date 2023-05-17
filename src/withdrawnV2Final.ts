import { ethers } from 'ethers'

import { tokenList } from "./constants/tokens"
import { R3vlClient } from './client'

export type FnArgs = {
  walletAddress?: string
  isERC20?: keyof typeof tokenList
  blockNumber?: number
}

/**
 *  V0
 */
export async function withdrawnFundsV2Final(this: R3vlClient, payload?: FnArgs) {
  const { revPathV2FinalRead, _chainId, sdk } = this

  if (!revPathV2FinalRead || !sdk) throw new Error("ERROR:")

  const { walletAddress, isERC20 } = payload || { walletAddress: undefined, isERC20: undefined }

  try {
    let released = walletAddress ? await revPathV2FinalRead.getTokenWithdrawn(
      isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero,
      walletAddress
    ) : await revPathV2FinalRead.getTotalTokenReleased(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)

    if (isERC20) {
      const decimals = await (sdk as any)[isERC20].decimals()
  
      released = ethers.utils.parseEther(ethers.utils.formatUnits(released.toString(), decimals))
    }

    const totalTiers = await revPathV2FinalRead.getTotalRevenueTiers()

    const result = totalTiers.toNumber() > 1 ? parseFloat(ethers.utils.formatEther(released)) + parseFloat(ethers.utils.formatEther(released)) * 0.0102 : parseFloat(ethers.utils.formatEther(released))

    return result
  } catch (error) {
    console.error(error)
  }
}
