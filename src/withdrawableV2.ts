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
      // const tierDistributed = await revPathV2Read.getTierDistributedAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, i)
      const tierLimit = (await revPathV2Read.getTokenTierLimits(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, i))// .sub(tierDistributed)

      let currentWalletLimit = ethers.BigNumber.from(0)
      let currentWalletProportion = ethers.BigNumber.from(0)
      let walletsTierLimit = ethers.BigNumber.from(0)

      for (let j = 0; j < walletList.length; j ++) {
        const walletTierProportion = await revPathV2Read.getRevenueProportion(i, walletList[j])
        const walletTierLimit = tierLimit.div(ethers.BigNumber.from(10000000)).mul(walletTierProportion)

        walletsTierLimit = walletsTierLimit.add(walletTierLimit)

        if (walletList[j] === walletAddress) {
          currentWalletProportion = walletTierProportion
          currentWalletLimit = walletTierLimit
        }
      }

      if (pendingDistribution.gte(walletsTierLimit)) {
        walletPendingDistribution = walletPendingDistribution.add(currentWalletLimit)

        pendingDistribution = pendingDistribution.sub(walletsTierLimit)
      } else if (pendingDistribution.lt(walletsTierLimit)) {
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

export async function withdrawableTiersV2(this: R3vlClient, payload?: FnArgs) {
  const { revPathV2Read, _chainId } = this

  if (!revPathV2Read) throw new Error("ERROR:")

  const { isERC20 } = payload || { isERC20: undefined }

  const totalTiers = await revPathV2Read.getTotalRevenueTiers()
  let pendingDistribution = await revPathV2Read.getPendingDistributionAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)
  
  const tiers = []

  for (let i = 0; i < totalTiers.toNumber(); i++) {
    pendingDistribution = pendingDistribution.add(await revPathV2Read.getTierDistributedAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, i))
  }
  
  for (let i = 0; i < totalTiers.toNumber(); i++) {
    const wallets: any = {}
    const lastTier = totalTiers.toNumber() - 1
    const walletList = await revPathV2Read.getRevenueTier(i)
    const tierLimit = await revPathV2Read.getTokenTierLimits(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, i)

    let walletsTierLimit = ethers.BigNumber.from(0)

    for (let j = 0; j < walletList.length; j ++) {
      const walletTierProportion = await revPathV2Read.getRevenueProportion(i, walletList[j])
      const walletTierLimit = tierLimit.div(ethers.BigNumber.from(10000000)).mul(walletTierProportion)

      walletsTierLimit = walletsTierLimit.add(walletTierLimit)
    }

    for (let j = 0; j < walletList.length; j ++) {
      const walletTierProportion = await revPathV2Read.getRevenueProportion(i, walletList[j])
      const walletTierLimit = tierLimit.div(ethers.BigNumber.from(10000000)).mul(walletTierProportion)
      
      if (parseFloat(ethers.utils.formatEther(tierLimit)) === 0) {
        let received = pendingDistribution.div(ethers.BigNumber.from(10000000)).mul(walletTierProportion)

        if (j + 1 === walletList.length) received = pendingDistribution

        wallets[walletList[j]] = parseFloat(ethers.utils.formatEther(received))

        pendingDistribution = pendingDistribution.sub(received)

        continue
      }

      if (pendingDistribution.gte(walletsTierLimit)) {
        wallets[walletList[j]] = parseFloat(ethers.utils.formatEther(walletTierLimit))
        
        pendingDistribution = pendingDistribution.sub(walletTierLimit)
      } else if (pendingDistribution.lt(walletsTierLimit)) {
        let received = pendingDistribution.div(ethers.BigNumber.from(10000000)).mul(walletTierProportion)

        if (received.gte(walletTierLimit) || pendingDistribution.gt(walletTierLimit)) received = walletTierLimit
        if (j + 1 === walletList.length && walletTierLimit.gte(pendingDistribution)) received = pendingDistribution

        wallets[walletList[j]] = parseFloat(ethers.utils.formatEther(received))

        pendingDistribution = pendingDistribution.sub(received)
      }
    }

    tiers.push(wallets)
  }

  return tiers
}
