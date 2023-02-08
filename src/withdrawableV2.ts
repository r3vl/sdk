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
    let pendingBalance: ethers.BigNumber
    
    if (walletAddress) {
      pendingBalance = await revPathV2Read.getWithdrawableToken(
        isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero,
        walletAddress
      )
    } else {
      const pendingDistribution = await revPathV2Read.getPendingDistributionAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)

      const withdrawable: ethers.BigNumber = ethers.BigNumber.from(0)
      const currentTier = await revPathV2Read.getTotalRevenueTiers()
      const _walletList: string[] = []

      for (let i = 0; i < currentTier?.toNumber(); i++) {
        const walletList = await revPathV2Read.getRevenueTier(i)

        walletList.map((wallet) => {
          if (!~_walletList.indexOf(wallet)) _walletList.push(wallet)
        })
      }

      for (let i = 0; i < _walletList.length; i++) {
        withdrawable.add(await revPathV2Read.getWithdrawableToken(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, _walletList[i]))
      }

      pendingBalance = withdrawable.add(pendingDistribution)
    }

    return parseFloat(ethers.utils.formatEther(pendingBalance))
  } catch (error) {
    console.error(error)
  }
}
