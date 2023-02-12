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
export async function withdrawableV2(this: R3vlClient, payload?: FnArgs) {
  const { revPathV2Read, _chainId } = this

  if (!revPathV2Read) throw new Error("ERROR:")

  const { walletAddress, isERC20 } = payload || { walletAddress: undefined, isERC20: undefined }

  try {
    // const totalTiers = await revPathV2Read.getTotalRevenueTiers()
    let pendingDistribution = await revPathV2Read.getPendingDistributionAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)
    
    if (walletAddress) {
      let withdrawable = await revPathV2Read.getWithdrawableToken(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, walletAddress)

      return [parseFloat(ethers.utils.formatEther(pendingDistribution)), parseFloat(ethers.utils.formatEther(withdrawable))]
    } else {
      const accounted = await revPathV2Read.getTotalTokenAccounted(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)
      const withdrawn = await revPathV2Read.getTotalTokenReleased(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)

      return [parseFloat(ethers.utils.formatEther(pendingDistribution)), parseFloat(ethers.utils.formatEther(accounted.sub(withdrawn)))]
    }
  } catch (error) {
    console.error(error)
  }
}
