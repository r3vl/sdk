import { ethers } from 'ethers'

import { tokenList } from "./constants/tokens"
import { R3vlClient } from './client'

export type FnArgs = {
  walletAddress?: string
  isERC20?: keyof typeof tokenList
}

/**
 *  V2
 */
export async function withdrawableV2(this: R3vlClient, payload?: FnArgs) {
  const { revPathV2Read, _chainId } = this

  if (!revPathV2Read) throw new Error("ERROR:")

  const { walletAddress, isERC20 } = payload || { walletAddress: undefined, isERC20: undefined }

  const totalTiers = await revPathV2Read.getTotalRevenueTiers()
  let pendingDistribution = await revPathV2Read.getPendingDistributionAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)
  
  if (walletAddress) {
    const withdrawable = await revPathV2Read.getWithdrawableToken(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, walletAddress)
    let walletPendingDistribution = ethers.BigNumber.from(0)

    for (let i = 0; i < totalTiers.toNumber(); i++) {
      const lastTier = totalTiers.toNumber() - 1
      const walletList = await revPathV2Read.getRevenueTier(i)
      const tierLimit = await revPathV2Read.getTokenTierLimits(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, i)

      let currentWalletLimit = ethers.BigNumber.from(0)
      let currentWalletProportion = ethers.BigNumber.from(0)
      let walletsTierLimit = ethers.BigNumber.from(0)

      for (let j = 0; j < walletList.length; j ++) {
        const walletTierProportion = await revPathV2Read.getRevenueProportion(i, walletList[j])
        const walletTierLimit = tierLimit.div(ethers.BigNumber.from(10000000)).mul(walletTierProportion)
        
        walletsTierLimit = walletsTierLimit.add(walletTierLimit)

        if (walletList[j] === walletAddress) {
          currentWalletLimit = walletTierLimit
          currentWalletProportion = walletTierProportion
        }
      }
      
      if (pendingDistribution.gte(walletsTierLimit)) {
        walletPendingDistribution = walletPendingDistribution.add(currentWalletLimit)

        pendingDistribution = pendingDistribution.sub(walletsTierLimit)
      }

      if (i === lastTier) {
        walletPendingDistribution = walletPendingDistribution.add(pendingDistribution.div(ethers.BigNumber.from(10000000)).mul(currentWalletProportion))
      }
    }

    return [parseFloat(ethers.utils.formatEther(walletPendingDistribution)), parseFloat(ethers.utils.formatEther(withdrawable))]
  } else {
    const accounted = await revPathV2Read.getTotalTokenAccounted(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)
    const withdrawn = await revPathV2Read.getTotalTokenReleased(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)

    return [parseFloat(ethers.utils.formatEther(pendingDistribution)), parseFloat(ethers.utils.formatEther(accounted.sub(withdrawn)))]
  }
}
