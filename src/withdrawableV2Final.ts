import { ethers } from 'ethers'

import { tokenList } from "./constants/tokens"
import { R3vlClient } from './client'

export type FnArgs = {
  walletAddress?: string
  isERC20?: keyof typeof tokenList
}

export const parseWalletTier = (metadata: any, tierNumber: number, walletIndex: number, isERC20?: string) => {
  const _tier = metadata.tiers[tierNumber]
  const walletLimit = metadata.distribution[tierNumber][walletIndex]

  const tierLimit = isERC20 ?
    _tier?.[isERC20 as any] as string || "0" :
    _tier?.eth || "0"

  return {
    proportion: ethers.utils.parseEther(walletLimit + ""),
    limit: ethers.utils.parseEther((walletLimit /  100 * tierLimit).toLocaleString('fullwide', {maximumFractionDigits: 18}) + "")
  }
}

/**
 *  V2
 */
export async function withdrawableV2Final(this: R3vlClient, payload?: FnArgs) {
  const { revPathV2FinalRead, _chainId, sdk, _revPathAddress } = this
  const revPathMetadata = JSON.parse(localStorage.getItem(`r3vl-metadata-${_revPathAddress}`) || "")

  if (!revPathV2FinalRead || !sdk) throw new Error("ERROR:")

  const { isERC20, walletAddress } = payload || { isERC20: undefined, walletAddress: null }

  const divideBy = ethers.BigNumber.from(10000000)
  const totalTiersPromise = revPathV2FinalRead.getTotalRevenueTiers()
  let pendingDistributionPromise = revPathV2FinalRead.getPendingDistributionAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)

  let [totalTiers, pendingDistribution] = await Promise.all([totalTiersPromise, pendingDistributionPromise])
  let decimals

  if (isERC20) {
    decimals = await (sdk as any)[isERC20].decimals()

    pendingDistribution = ethers.utils.parseEther(ethers.utils.formatUnits(pendingDistribution.toString(), decimals))
  }

  const tiers = []
  const distributedPromises = []

  for (let i = 0; i < totalTiers.toNumber(); i++) {
    distributedPromises[i] = revPathV2FinalRead.getTierDistributedAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, i)
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
    const walletList = revPathMetadata?.walletList[i] || []
    const tierLimitPromise = revPathV2FinalRead.getTokenTierLimits(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, i)

    const [tierLimit] = await Promise.all([tierLimitPromise])

    let walletsTierLimit = ethers.BigNumber.from(0)
    const walletTier = []

    for (let j = 0; j < walletList.length; j++) {
      walletTier[j] = parseWalletTier(revPathMetadata, i, j, isERC20)
    }

    for (const walletTierProportioId in walletTier) {
      const walletTierLimit = walletTier[walletTierProportioId].limit

      walletsTierLimit = walletsTierLimit.add(walletTierLimit)
    }

    for (let j = 0; j < walletList.length; j++) {
      const walletTierProportion = walletTier[j].proportion
      const walletTierLimit = walletTier[j].limit

      if (parseFloat(ethers.utils.formatEther(tierLimit)) === 0) {
        let received = (parseFloat(ethers.utils.formatEther(pendingDistribution.mul(100))) / 100) * (parseFloat(ethers.utils.formatEther(walletTierProportion)) / 100)

        wallets[walletList[j]] = received

        continue
      }

      if (pendingDistribution.gte(walletsTierLimit)) {
        wallets[walletList[j]] = parseFloat(ethers.utils.formatEther(walletTierLimit))

        pendingDistribution = pendingDistribution.sub(walletTierLimit)
      } else if (pendingDistribution.lt(walletsTierLimit)) {
        let received = pendingDistribution.div(walletTierProportion.div(ethers.BigNumber.from(100)))


        if (received.gte(walletTierLimit) || pendingDistribution.gt(walletTierLimit)) received = walletTierLimit
        if (j + 1 === walletList.length && walletTierLimit.gte(pendingDistribution)) received = pendingDistribution

        wallets[walletList[j]] = parseFloat(ethers.utils.formatEther(received))

        pendingDistribution = pendingDistribution.sub(received)
      }
    }

    tiers.push(wallets)
  }

  return tiers.reduce((prev, curr) => {
    /// if (id === 1) throw new Error(JSON.stringify(curr))
    return prev + (
      walletAddress ?
        (curr?.[walletAddress] || 0) :
        Object.keys(curr).reduce((_prev, _curr) => _prev + (curr[_curr]), 0)
    )
  }, 0)
}

export async function withdrawableTiersV2Final(this: R3vlClient, payload?: FnArgs) {
  const { revPathV2FinalRead, _chainId, sdk, _revPathAddress } = this
  const revPathMetadata = JSON.parse(localStorage.getItem(`r3vl-metadata-${_revPathAddress}`) || "")

  if (!revPathV2FinalRead || !sdk) throw new Error("ERROR:")

  const { isERC20 } = payload || { isERC20: undefined }

  const divideBy = ethers.BigNumber.from(10000000)
  const totalTiers = await revPathV2FinalRead.getTotalRevenueTiers()
  let pendingDistribution = await revPathV2FinalRead.getPendingDistributionAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)

  if (isERC20) {
    const decimals = await (sdk as any)[isERC20].decimals()

    pendingDistribution = ethers.utils.parseEther(ethers.utils.formatUnits(pendingDistribution.toString(), decimals))
  }

  const tiers = []

  for (let i = 0; i < totalTiers.toNumber(); i++) {
    let distributed = await revPathV2FinalRead.getTierDistributedAmount(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, i)

    if (isERC20) {
      const decimals = await (sdk as any)[isERC20].decimals()
  
      distributed = ethers.utils.parseEther(ethers.utils.formatUnits(distributed.toString(), decimals))
    }

    pendingDistribution = pendingDistribution.add(distributed)
  }

  for (let i = 0; i < totalTiers.toNumber(); i++) {
    const wallets: any = {}
    const walletList = revPathMetadata?.walletList[i] || []
    const tierLimit = await revPathV2FinalRead.getTokenTierLimits(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, i)

    let walletsTierLimit = ethers.BigNumber.from(0)

    for (let j = 0; j < walletList.length; j ++) {
      const walletTierLimit = parseWalletTier(revPathMetadata, i, j, isERC20).limit

      walletsTierLimit = walletsTierLimit.add(walletTierLimit)
    }

    for (let j = 0; j < walletList.length; j ++) {
      const walletTierProportion = parseWalletTier(revPathMetadata, i, j, isERC20).proportion
      const walletTierLimit = parseWalletTier(revPathMetadata, i, j, isERC20).limit
      
      if (parseFloat(ethers.utils.formatEther(tierLimit)) === 0) {
        let received = (parseFloat(ethers.utils.formatEther(pendingDistribution.mul(1000000))) / 1000000) * (parseFloat(ethers.utils.formatEther(walletTierProportion)) / 100)

        wallets[walletList[j]] = received

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
