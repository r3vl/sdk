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
    const totalTiers = await revPathV2Read.getTotalRevenueTiers()
    let pendingDistribution = await revPathV2Read.getPendingDistributionAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)
    
    if (walletAddress) {
      let totalAmount

      totalAmount = await revPathV2Read.getWithdrawableToken(
        isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero,
        walletAddress
      )

      for (let i = 0; i < totalTiers?.toNumber(); i++) {
        const tierLimit = await revPathV2Read.getTokenTierLimits(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, walletAddress)
        const proportion = await revPathV2Read.getRevenueProportion(i, walletAddress)

        if (
          tierLimit.gt(pendingDistribution) ||
          (tierLimit.eq(ethers.BigNumber.from(0)) && pendingDistribution.gt(ethers.BigNumber.from(0)))
        ) {
          totalAmount = totalAmount.add(pendingDistribution.div(ethers.BigNumber.from(10000000)).mul(proportion))

          break
        } else {
          const distribution = pendingDistribution.div(ethers.BigNumber.from(10000000)).mul(proportion)

          totalAmount = totalAmount.add(distribution)
          pendingDistribution = pendingDistribution.sub(distribution)
        }
      }

      pendingBalance = totalAmount
    } else {
      let totalAmount: ethers.BigNumber = ethers.BigNumber.from(0)
      const _walletList: string[] = []

      for (let i = 0; i < totalTiers?.toNumber(); i++) {
        const walletList = await revPathV2Read.getRevenueTier(i)

        walletList.map((wallet) => {
          if (!~_walletList.indexOf(wallet)) _walletList.push(wallet)
        })
      }

      for (let i = 0; i < _walletList.length; i++) {
        totalAmount = totalAmount.add(await revPathV2Read.getWithdrawableToken(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, _walletList[i]))
      }

      pendingBalance = totalAmount.add(pendingDistribution)
    }

    return parseFloat(ethers.utils.formatEther(pendingBalance))
  } catch (error) {
    console.error(error)
  }
}
