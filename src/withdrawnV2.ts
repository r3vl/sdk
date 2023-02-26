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
export async function withdrawnFundsV2(this: R3vlClient, payload?: FnArgs) {
  const { revPathV2Read, _chainId, sdk } = this

  if (!revPathV2Read || !sdk) throw new Error("ERROR:")

  const { walletAddress, isERC20 } = payload || { walletAddress: undefined, isERC20: undefined }

  try {
    let released = walletAddress ? await revPathV2Read.getTokenWithdrawn(
      isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero,
      walletAddress
    ) : await revPathV2Read.getTotalTokenReleased(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)

    if (isERC20) {
      const decimals = await (sdk as any)[isERC20].decimals()
  
      released = ethers.utils.parseEther(ethers.utils.formatUnits(released.toString(), decimals))
    }

    const totalTiers = await revPathV2Read.getTotalRevenueTiers()

    const result = totalTiers.toNumber() > 0 ? parseFloat(ethers.utils.formatEther(released)) + parseFloat(ethers.utils.formatEther(released)) * 0.01 : parseFloat(ethers.utils.formatEther(released))

    return result
  } catch (error) {
    console.error(error)
  }
}
