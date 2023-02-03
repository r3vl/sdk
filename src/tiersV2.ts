import { ethers } from 'ethers'

import { R3vlClient } from './client'


export type TierType = {
  walletList: string[]
  isCurrentTier: { [x: string]: boolean }
  distributedAmount: { [x: string]: number }
  proportions: { [x: string]: number }
  limitsAmount: { [x: string]: number }
}

/**
 *  V2
 */
export async function tiersV2(this: R3vlClient): Promise<TierType[] | undefined> {
  const { revPathV2Read, sdk } = this

  if (!revPathV2Read || !sdk) throw new Error("ERROR:.")

  const tiersNumber = await revPathV2Read.getTotalRevenueTiers()
  const currentTierETH = await revPathV2Read.getCurrentTier(ethers.constants.AddressZero)
  const currentTierWETH = await revPathV2Read.getCurrentTier(sdk.weth.address)
  const currentTierUSDC = await revPathV2Read.getCurrentTier(sdk.usdc.address)
  const currentTierDAI = await revPathV2Read.getCurrentTier(sdk.dai.address)
  const tiers = []

  for (let i = 0; i < tiersNumber?.toNumber(); i++) {
    const walletList = await revPathV2Read.getRevenueTier(i)

    const distributedAmountETH = await revPathV2Read.getTierDistributedAmount(ethers.constants.AddressZero, i)
    const distributedAmountWETH = await revPathV2Read.getTierDistributedAmount(sdk.weth.address, i)
    const distributedAmountUSDC = await revPathV2Read.getTierDistributedAmount(sdk.usdc.address, i)
    const distributedAmountDAI = await revPathV2Read.getTierDistributedAmount(sdk.dai.address, i)

    const tierLimitsETH = await revPathV2Read.getTokenTierLimits(ethers.constants.AddressZero, i)
    const tierLimitsWETH = await revPathV2Read.getTokenTierLimits(sdk.weth.address, i)
    const tierLimitsUSDC = await revPathV2Read.getTokenTierLimits(sdk.usdc.address, i)
    const tierLimitsDAI = await revPathV2Read.getTokenTierLimits(sdk.dai.address, i)

    const proportions = {} as { [walletAddress: string]: number }

    for (const wallet of walletList) {
      const r = await revPathV2Read.getRevenueProportion(i, wallet)

      proportions[wallet] =  parseFloat(ethers.utils.formatEther(r))
    }

    tiers.push({
      walletList,
      isCurrentTier: {
        [ethers.constants.AddressZero]: i === currentTierETH?.toNumber(),
        [sdk.weth.address]: i === currentTierWETH?.toNumber(),
        [sdk.usdc.address]: i === currentTierUSDC?.toNumber(),
        [sdk.dai.address]: i === currentTierDAI?.toNumber(),
      },
      distributedAmount: {
        [ethers.constants.AddressZero]: parseFloat(ethers.utils.formatEther(distributedAmountETH)),
        [sdk.weth.address]: parseFloat(ethers.utils.formatEther(distributedAmountWETH)),
        [sdk.usdc.address]: parseFloat(ethers.utils.formatEther(distributedAmountUSDC)),
        [sdk.dai.address]: parseFloat(ethers.utils.formatEther(distributedAmountDAI)),
      },
      limitsAmount: {
        [ethers.constants.AddressZero]: parseFloat(ethers.utils.formatEther(tierLimitsETH)),
        [sdk.weth.address]: parseFloat(ethers.utils.formatEther(tierLimitsWETH)),
        [sdk.usdc.address]: parseFloat(ethers.utils.formatEther(tierLimitsUSDC)),
        [sdk.dai.address]: parseFloat(ethers.utils.formatEther(tierLimitsDAI)),
      },
      proportions
    })
  }

  return tiers
}
