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

  const divideBy = ethers.BigNumber.from(10000000)
  const totalTiersPromise = revPathV2Read.getTotalRevenueTiers()
  let pendingDistributionPromise = revPathV2Read.getPendingDistributionAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)

  let [totalTiers, pendingDistribution] = await Promise.all([totalTiersPromise, pendingDistributionPromise])
  let decimals

  if (isERC20) {
    decimals = await (sdk as any)[isERC20].decimals()

    pendingDistribution = ethers.utils.parseEther(ethers.utils.formatUnits(pendingDistribution.toString(), decimals))
  }

  const tiers = []
  const distributedPromises = []

  for (let i = 0; i < totalTiers.toNumber(); i++) {
    distributedPromises[i] = revPathV2Read.getTierDistributedAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, i)
  }

  const distributedAll = await Promise.all(distributedPromises)

  for (const _distributed of distributedAll) {
    let distributed = _distributed

    if (isERC20) {
      distributed = ethers.utils.parseEther(ethers.utils.formatUnits(distributed.toString(), decimals))
    }

    pendingDistribution = pendingDistribution.add(distributed)
  }

  for (let i = 0; i < totalTiers.toNumber(); i++) {
    const wallets: any = {}
    const walletListPromise = revPathV2Read.getRevenueTier(i)
    const tierLimitPromise = revPathV2Read.getTokenTierLimits(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, i)

    const [walletList, tierLimit] = await Promise.all([walletListPromise, tierLimitPromise])

    let walletsTierLimit = ethers.BigNumber.from(0)
    const walletTierProportionPromises = []

    for (let j = 0; j < walletList.length; j ++) {
      walletTierProportionPromises[j] = revPathV2Read.getRevenueProportion(i, walletList[j])
    }

    const walletTierProportions = await Promise.all(walletTierProportionPromises)

    for (const walletTierProportioId in walletTierProportions) {
      const walletTierProportion = walletTierProportions[walletTierProportioId]
      const walletTierLimit = tierLimit.div(divideBy).mul(walletTierProportion)

      walletsTierLimit = walletsTierLimit.add(walletTierLimit)
    }

    for (let j = 0; j < walletList.length; j ++) {
      const walletTierProportion = walletTierProportions[j]
      const walletTierLimit = tierLimit.div(divideBy).mul(walletTierProportion)

      if (parseFloat(ethers.utils.formatEther(tierLimit)) === 0) {
        let received = pendingDistribution.div(divideBy).mul(walletTierProportion)

        wallets[walletList[j]] = parseFloat(ethers.utils.formatEther(received))

        continue
      }

      if (pendingDistribution.gte(walletsTierLimit)) {
        wallets[walletList[j]] = parseFloat(ethers.utils.formatEther(walletTierLimit))
        
        pendingDistribution = pendingDistribution.sub(walletTierLimit)
      } else if (pendingDistribution.lt(walletsTierLimit)) {
        let received = pendingDistribution.div(divideBy).mul(walletTierProportion)

        if (received.gte(walletTierLimit) || pendingDistribution.gt(walletTierLimit)) received = walletTierLimit
        if (j + 1 === walletList.length && walletTierLimit.gte(pendingDistribution)) received = pendingDistribution

        wallets[walletList[j]] = parseFloat(ethers.utils.formatEther(received))

        pendingDistribution = pendingDistribution.sub(received)
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

  const divideBy = ethers.BigNumber.from(10000000)
  const totalTiers = await revPathV2Read.getTotalRevenueTiers()
  let pendingDistribution = await revPathV2Read.getPendingDistributionAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)

  if (isERC20) {
    const decimals = await (sdk as any)[isERC20].decimals()

    pendingDistribution = ethers.utils.parseEther(ethers.utils.formatUnits(pendingDistribution.toString(), decimals))
  }

  const tiers = []

  for (let i = 0; i < totalTiers.toNumber(); i++) {
    let distributed = await revPathV2Read.getTierDistributedAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, i)

    if (isERC20) {
      const decimals = await (sdk as any)[isERC20].decimals()
  
      distributed = ethers.utils.parseEther(ethers.utils.formatUnits(distributed.toString(), decimals))
    }

    pendingDistribution = pendingDistribution.add(distributed)
  }

  for (let i = 0; i < totalTiers.toNumber(); i++) {
    const wallets: any = {}
    const lastTier = totalTiers.toNumber() - 1
    const walletList = await revPathV2Read.getRevenueTier(i)
    const tierLimit = await revPathV2Read.getTokenTierLimits(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, i)

    let walletsTierLimit = ethers.BigNumber.from(0)

    for (let j = 0; j < walletList.length; j ++) {
      const walletTierProportion = await revPathV2Read.getRevenueProportion(i, walletList[j])
      const walletTierLimit = tierLimit.div(divideBy).mul(walletTierProportion)

      walletsTierLimit = walletsTierLimit.add(walletTierLimit)
    }

    for (let j = 0; j < walletList.length; j ++) {
      const walletTierProportion = await revPathV2Read.getRevenueProportion(i, walletList[j])
      const walletTierLimit = tierLimit.div(divideBy).mul(walletTierProportion)
      
      if (parseFloat(ethers.utils.formatEther(tierLimit)) === 0) {
        let received = pendingDistribution.div(divideBy).mul(walletTierProportion)

        // if (j + 1 === walletList.length) received = pendingDistribution

        wallets[walletList[j]] = parseFloat(ethers.utils.formatEther(received))

        continue
      }

      if (pendingDistribution.gte(walletsTierLimit)) {
        wallets[walletList[j]] = parseFloat(ethers.utils.formatEther(walletTierLimit))
        
        pendingDistribution = pendingDistribution.sub(walletTierLimit)
      } else if (pendingDistribution.lt(walletsTierLimit)) {
        let received = pendingDistribution.div(divideBy).mul(walletTierProportion)

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
