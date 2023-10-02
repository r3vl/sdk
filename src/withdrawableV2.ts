import { ethers } from 'ethers'

import { tokenList } from "./constants/tokens"
import { R3vlClient } from './client'
import { withdrawnFundsV2 } from './withdrawnV2'

export type FnArgs = {
  walletAddress?: string
  isERC20?: keyof typeof tokenList
}

/**
 *  V2
 */
export async function withdrawableV2(this: R3vlClient, payload?: FnArgs) {
  const { revPathV2Read, _chainId, sdk } = this

  if (!revPathV2Read || !sdk) throw new Error("ERROR:")

  const { isERC20, walletAddress } = payload || { isERC20: undefined, walletAddress: null }

  const divideBy = BigInt(10000000)
  const totalTiersPromise = revPathV2Read.getTotalRevenueTiers()
  let pendingDistributionPromise = revPathV2Read.getPendingDistributionAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.ZeroAddress)

  let [totalTiers, pendingDistribution] = await Promise.all([totalTiersPromise, pendingDistributionPromise])
  let decimals

  if (isERC20) {
    decimals = await (sdk as any)[isERC20].decimals()

    pendingDistribution = ethers.parseEther(ethers.formatUnits(pendingDistribution.toString(), decimals))
  }

  const tiers = []
  const distributedPromises = []

  for (let i = 0; i < totalTiers; i++) {
    distributedPromises[i] = revPathV2Read.getTierDistributedAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.ZeroAddress, i)
  }

  const distributedAll = await Promise.all(distributedPromises)

  for (const _distributed of distributedAll) {
    let distributed = _distributed

    if (isERC20) {
      distributed = ethers.parseEther(ethers.formatUnits(distributed.toString(), decimals))
    }

    pendingDistribution = pendingDistribution + distributed
  }

  for (let i = 0; i < totalTiers; i++) {
    const wallets: any = {}
    const walletListPromise = revPathV2Read.getRevenueTier(i)
    const tierLimitPromise = revPathV2Read.getTokenTierLimits(isERC20 ? tokenList[isERC20][_chainId] : ethers.ZeroAddress, i)

    const [walletList, tierLimit] = await Promise.all([walletListPromise, tierLimitPromise])

    let walletsTierLimit = BigInt(0)
    const walletTierProportionPromises = []

    for (let j = 0; j < walletList.length; j ++) {
      walletTierProportionPromises[j] = revPathV2Read.getRevenueProportion(i, walletList[j])
    }

    const walletTierProportions = await Promise.all(walletTierProportionPromises)

    for (const walletTierProportioId in walletTierProportions) {
      const walletTierProportion = walletTierProportions[walletTierProportioId]
      const walletTierLimit = tierLimit / divideBy * walletTierProportion

      walletsTierLimit = walletsTierLimit + walletTierLimit
    }

    for (let j = 0; j < walletList.length; j ++) {
      const walletTierProportion = walletTierProportions[j]
      const walletTierLimit = tierLimit / divideBy * walletTierProportion

      if (parseFloat(ethers.formatEther(tierLimit)) === 0) {
        let received = pendingDistribution / divideBy * walletTierProportion

        wallets[walletList[j]] = parseFloat(ethers.formatEther(received))

        continue
      }

      if (pendingDistribution >= walletsTierLimit) {
        wallets[walletList[j]] = parseFloat(ethers.formatEther(walletTierLimit))
        
        pendingDistribution = pendingDistribution - walletTierLimit
      } else if (pendingDistribution < walletsTierLimit) {
        let received = pendingDistribution / divideBy * walletTierProportion

        if (received >= walletTierLimit || pendingDistribution > walletTierLimit) received = walletTierLimit
        if (j + 1 === walletList.length && walletTierLimit >= pendingDistribution) received = pendingDistribution

        wallets[walletList[j]] = parseFloat(ethers.formatEther(received))

        pendingDistribution = pendingDistribution - received
      }
    }

    tiers.push(wallets)
  }

  return tiers.reduce((prev, curr) => {
    return prev + (
      walletAddress ?
        (curr?.[walletAddress] || 0) :
        Object.keys(curr).reduce((_prev, _curr) => _prev + (curr[_curr]), 0)
    )
  }, 0)
}

export async function withdrawableTiersV2(this: R3vlClient, payload?: FnArgs) {
  const { revPathV2Read, _chainId, sdk } = this

  if (!revPathV2Read || !sdk) throw new Error("ERROR:")

  const { isERC20 } = payload || { isERC20: undefined }

  const divideBy = BigInt(10000000)
  const totalTiers = await revPathV2Read.getTotalRevenueTiers()
  let pendingDistribution = await revPathV2Read.getPendingDistributionAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.ZeroAddress)

  if (isERC20) {
    const decimals = await (sdk as any)[isERC20].decimals()

    pendingDistribution = ethers.parseEther(ethers.formatUnits(pendingDistribution.toString(), decimals))
  }

  const tiers = []

  for (let i = 0; i < totalTiers; i++) {
    let distributed = await revPathV2Read.getTierDistributedAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.ZeroAddress, i)

    if (isERC20) {
      const decimals = await (sdk as any)[isERC20].decimals()
  
      distributed = ethers.parseEther(ethers.formatUnits(distributed.toString(), decimals))
    }

    pendingDistribution = pendingDistribution + distributed
  }

  for (let i = 0; i < totalTiers; i++) {
    const wallets: any = {}
    const lastTier = totalTiers - BigInt(1)
    const walletList = await revPathV2Read.getRevenueTier(i)
    const tierLimit = await revPathV2Read.getTokenTierLimits(isERC20 ? tokenList[isERC20][_chainId] : ethers.ZeroAddress, i)

    let walletsTierLimit = BigInt(0)

    for (let j = 0; j < walletList.length; j ++) {
      const walletTierProportion = await revPathV2Read.getRevenueProportion(i, walletList[j])
      const walletTierLimit = tierLimit / divideBy * walletTierProportion

      walletsTierLimit = walletsTierLimit + walletTierLimit
    }

    for (let j = 0; j < walletList.length; j ++) {
      const walletTierProportion = await revPathV2Read.getRevenueProportion(i, walletList[j])
      const walletTierLimit = tierLimit / divideBy * walletTierProportion
      
      if (parseFloat(ethers.formatEther(tierLimit)) === 0) {
        let received = pendingDistribution / divideBy * walletTierProportion

        // if (j + 1 === walletList.length) received = pendingDistribution

        wallets[walletList[j]] = parseFloat(ethers.formatEther(received))

        continue
      }

      if (pendingDistribution >= walletsTierLimit) {
        wallets[walletList[j]] = parseFloat(ethers.formatEther(walletTierLimit))
        
        pendingDistribution = pendingDistribution - walletTierLimit
      } else if (pendingDistribution < walletsTierLimit) {
        let received = pendingDistribution / divideBy * walletTierProportion

        if (received >= walletTierLimit || pendingDistribution > walletTierLimit) received = walletTierLimit
        if (j + 1 === walletList.length && walletTierLimit >= pendingDistribution) received = pendingDistribution

        wallets[walletList[j]] = parseFloat(ethers.formatEther(received))

        pendingDistribution = pendingDistribution - received
      }
    }

    tiers.push(wallets)
  }

  return tiers
}
