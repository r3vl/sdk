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
    const totalTiers = await revPathV2Read.getTotalRevenueTiers()
    let pendingDistribution = await revPathV2Read.getPendingDistributionAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)
    
    if (walletAddress) {
      let walletPendingDistribution = ethers.BigNumber.from(0)

      for (let i = 0; i < totalTiers?.toNumber(); i++) {
        const tierLimit = await revPathV2Read.getTokenTierLimits(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, walletAddress)
        const proportion = await revPathV2Read.getRevenueProportion(i, walletAddress)

        if (
          tierLimit.gt(pendingDistribution) ||
          (tierLimit.eq(ethers.BigNumber.from(0)) && pendingDistribution.gt(ethers.BigNumber.from(0)))
        ) {
          walletPendingDistribution = walletPendingDistribution.add(pendingDistribution.div(ethers.BigNumber.from(10000000)).mul(proportion))

          break
        } else {
          const distribution = pendingDistribution.div(ethers.BigNumber.from(10000000)).mul(proportion)

          walletPendingDistribution = walletPendingDistribution.add(distribution)
          pendingDistribution = pendingDistribution.sub(distribution)
        }
      }
      
      if (walletPendingDistribution.gt(ethers.BigNumber.from(0))) {
        return ['pendingDistribution', parseFloat(ethers.utils.formatEther(walletPendingDistribution))]
      }

      const withdrawable = await revPathV2Read.getWithdrawableToken(
        isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero,
        walletAddress
      )

      return ['withdrawable', parseFloat(ethers.utils.formatEther(withdrawable))]
    } else {
      if (pendingDistribution.gt(ethers.BigNumber.from(0))) return ['pendingDistribution', parseFloat(ethers.utils.formatEther(pendingDistribution))]

      let wtihdrawable: ethers.BigNumber = ethers.BigNumber.from(0)
      const _walletList: string[] = []

      for (let i = 0; i < totalTiers?.toNumber(); i++) {
        const walletList = await revPathV2Read.getRevenueTier(i)

        walletList.map((wallet) => {
          if (!~_walletList.indexOf(wallet)) _walletList.push(wallet)
        })
      }

      for (let i = 0; i < _walletList.length; i++) {
        wtihdrawable = wtihdrawable.add(await revPathV2Read.getWithdrawableToken(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, _walletList[i]))
      }

      return ['withdrawable', parseFloat(ethers.utils.formatEther(wtihdrawable.add(pendingDistribution)))]
    }
  } catch (error) {
    console.error(error)
  }
}
