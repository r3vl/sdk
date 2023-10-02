import { ethers } from 'ethers'

import { chainIds, tokenList } from "./constants/tokens"
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
    _tier?.eth || _tier?.matic || "0"

  return {
    proportion: ethers.parseEther(walletLimit + ""),
    limit: ethers.parseEther((walletLimit /  100 * tierLimit).toLocaleString('fullwide', {maximumFractionDigits: 18}) + "")
  }
}

/**
 *  V2
 */
export async function withdrawableV2Final(this: R3vlClient, payload?: FnArgs) {
  const { revPathV2FinalRead, _chainId, sdk, _revPathAddress } = this
  const revPathMetadata = JSON.parse(localStorage.getItem(`r3vl-metadata-${_revPathAddress}`) || "")

  if (!revPathV2FinalRead || !sdk) throw new Error("ERROR:")

  const AddressZero = /* _chainId === chainIds.polygonMumbai || _chainId === chainIds.polygon ? '0x0000000000000000000000000000000000001010' : */ ethers.ZeroAddress
  const AddressZeroMATIC = _chainId === chainIds.polygonMumbai || _chainId === chainIds.polygon ? '0x0000000000000000000000000000000000001010' : ethers.ZeroAddress

  const { isERC20, walletAddress } = payload || { isERC20: undefined, walletAddress: null }

  const totalTiersPromise = revPathV2FinalRead.getTotalRevenueTiers()
  let pendingDistributionPromise = revPathV2FinalRead.getPendingDistributionAmount(isERC20 ? tokenList[isERC20][_chainId] : AddressZero)

  let [totalTiers, pendingDistribution] = await Promise.all([totalTiersPromise, pendingDistributionPromise])
  let decimals

  if (isERC20) {
    decimals = await (sdk as any)[isERC20].decimals()

    pendingDistribution = ethers.parseEther(ethers.formatUnits(pendingDistribution.toString(), decimals))
  }

  const tiers = []
  const distributedPromises = []

  for (let i = 0; i < totalTiers.toNumber(); i++) {
    distributedPromises[i] = revPathV2FinalRead.getTierDistributedAmount(isERC20 ? tokenList[isERC20][_chainId] : AddressZero, i)
  }

  const distributedAll = await Promise.all(distributedPromises)

  for (const _distributed of distributedAll) {
    let distributed = _distributed

    if (isERC20) {
      distributed = ethers.parseEther(ethers.formatUnits(distributed.toString(), decimals))
    }

    pendingDistribution = pendingDistribution.add(distributed)
  }

  for (let i = 0; i < totalTiers.toNumber(); i++) {
    const wallets: any = {}
    const walletList = revPathMetadata?.walletList[i] || []
    const tierLimit = await revPathV2FinalRead.getTokenTierLimits(isERC20 ? tokenList[isERC20][_chainId] : AddressZeroMATIC, i)

    let walletsTierLimit = ethers.BigNumberish.from(0)
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

      if (parseFloat(ethers.formatEther(tierLimit)) === 0) {
        let received = parseFloat(ethers.formatEther(pendingDistribution.mul(walletTierProportion).div(1000000000000000).div(100000)))

        wallets[walletList[j]] = received

        continue
      }

      if (pendingDistribution.gte(walletsTierLimit)) {
        wallets[walletList[j]] = parseFloat(ethers.formatEther(walletTierLimit))

        pendingDistribution = pendingDistribution.sub(walletTierLimit)
      } else if (pendingDistribution.lt(walletsTierLimit)) {
        let received = pendingDistribution.mul(walletTierProportion).div(1000000000000000).div(100000)

        if (received.gte(walletTierLimit) || pendingDistribution.gt(walletTierLimit)) received = walletTierLimit
        if (j + 1 === walletList.length && walletTierLimit.gte(pendingDistribution)) received = pendingDistribution

        wallets[walletList[j]] = parseFloat(ethers.formatEther(received))

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

export async function withdrawableTiersV2Final(this: R3vlClient, payload?: FnArgs) {
  const { revPathV2FinalRead, _chainId, sdk, _revPathAddress } = this
  const revPathMetadata = JSON.parse(localStorage.getItem(`r3vl-metadata-${_revPathAddress}`) || "")

  if (!revPathV2FinalRead || !sdk) throw new Error("ERROR:")

  const AddressZero = /* _chainId === chainIds.polygonMumbai || _chainId === chainIds.polygon ? '0x0000000000000000000000000000000000001010' : */ ethers.ZeroAddress
  const AddressZeroMATIC = _chainId === chainIds.polygonMumbai || _chainId === chainIds.polygon ? '0x0000000000000000000000000000000000001010' : ethers.ZeroAddress

  const { isERC20 } = payload || { isERC20: undefined }

  const totalTiers = await revPathV2FinalRead.getTotalRevenueTiers()
  let pendingDistribution = await revPathV2FinalRead.getPendingDistributionAmount(isERC20 ? tokenList[isERC20][_chainId] : AddressZero)

  if (isERC20) {
    const decimals = await (sdk as any)[isERC20].decimals()

    pendingDistribution = ethers.parseEther(ethers.formatUnits(pendingDistribution.toString(), decimals))
  }

  const tiers = []

  for (let i = 0; i < totalTiers.toNumber(); i++) {
    let distributed = await revPathV2FinalRead.getTierDistributedAmount(isERC20 ? tokenList[isERC20][_chainId] : AddressZero, i)

    if (isERC20) {
      const decimals = await (sdk as any)[isERC20].decimals()
  
      distributed = ethers.parseEther(ethers.formatUnits(distributed.toString(), decimals))
    }

    pendingDistribution = pendingDistribution.add(distributed)
  }

  for (let i = 0; i < totalTiers.toNumber(); i++) {
    const wallets: any = {}
    const walletList = revPathMetadata?.walletList[i] || []
    const tierLimit = await revPathV2FinalRead.getTokenTierLimits(isERC20 ? tokenList[isERC20][_chainId] : AddressZeroMATIC, i)

    let walletsTierLimit = ethers.BigNumberish.from(0)

    for (let j = 0; j < walletList.length; j ++) {
      const walletTierLimit = parseWalletTier(revPathMetadata, i, j, isERC20).limit

      walletsTierLimit = walletsTierLimit.add(walletTierLimit)
    }

    for (let j = 0; j < walletList.length; j ++) {
      const walletTierProportion = parseWalletTier(revPathMetadata, i, j, isERC20).proportion
      const walletTierLimit = parseWalletTier(revPathMetadata, i, j, isERC20).limit
      
      if (parseFloat(ethers.formatEther(tierLimit)) === 0) {
        let received = parseFloat(ethers.formatEther(pendingDistribution.mul(walletTierProportion).div(1000000000000000).div(100000)))

        wallets[walletList[j]] = received

        continue
      }

      if (pendingDistribution.gte(walletsTierLimit)) {
        wallets[walletList[j]] = parseFloat(ethers.formatEther(walletTierLimit))

        pendingDistribution = pendingDistribution.sub(walletTierLimit)
      } else if (pendingDistribution.lt(walletsTierLimit)) {
        let received = pendingDistribution.mul(walletTierProportion).div(1000000000000000).div(100000)

        if (received.gte(walletTierLimit) || pendingDistribution.gt(walletTierLimit)) received = walletTierLimit
        if (j + 1 === walletList.length && walletTierLimit.gte(pendingDistribution)) received = pendingDistribution

        wallets[walletList[j]] = parseFloat(ethers.formatEther(received))

        pendingDistribution = pendingDistribution.sub(received)
      }
    }

    tiers.push(wallets)
  }

  return tiers
}
