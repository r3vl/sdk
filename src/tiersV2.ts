import { ethers } from 'ethers'

import { R3vlClient } from './client'
import { getTokenListByAddress } from './constants/tokens'
import { withdrawableTiersV2 } from './withdrawableV2'


export type TierType = {
  walletList: string[]
  isCurrentTier: { [x: string]: boolean }
  available: { [x: string]: number }
  proportions: { [x: string]: number }
  limits: { [x: string]: number }
}

/**
 *  V2
 */
export async function tiersV2(this: R3vlClient): Promise<TierType[] | undefined> {
  const { revPathV2Read, sdk, _chainId } = this
  const _context = this

  if (!revPathV2Read || !sdk) throw new Error("ERROR:.")

  const tiersNumber = await revPathV2Read.getTotalRevenueTiers()
  const currentTierETHPromise = revPathV2Read.getCurrentTier(ethers.ZeroAddress)
  const currentTierWETHPromise = revPathV2Read.getCurrentTier(sdk.weth.target as string)
  const currentTierUSDCPromise = revPathV2Read.getCurrentTier(sdk.usdc.target as string)
  const currentTierDAIPromise = revPathV2Read.getCurrentTier(sdk.dai.target as string)
  const tiers = []

  const [
    currentTierETH,
    currentTierWETH,
    currentTierUSDC,
    currentTierDAI,
  ] = await Promise.all([
    currentTierETHPromise,
    currentTierWETHPromise,
    currentTierUSDCPromise,
    currentTierDAIPromise,
  ])
  
  const walletsDistributedETHPromise = withdrawableTiersV2.call(_context)
  const walletsDistributedWETHPromise = withdrawableTiersV2.call(_context, { isERC20: 'weth' })
  const walletsDistributedUSDCPromise = withdrawableTiersV2.call(_context, { isERC20: 'usdc' })
  const walletsDistributedDAIPromise = withdrawableTiersV2.call(_context, { isERC20: 'dai' })

  const [
    walletsDistributedETH,
    walletsDistributedWETH,
    walletsDistributedUSDC,
    walletsDistributedDAI,
  ] = await Promise.all([
    walletsDistributedETHPromise,
    walletsDistributedWETHPromise,
    walletsDistributedUSDCPromise,
    walletsDistributedDAIPromise,
  ])

  for (let i = 0; i < tiersNumber; i++) {
    const walletList = await revPathV2Read.getRevenueTier(i)

    // const availableETH = await revPathV2Read.getTierDistributedAmount(ethers.ZeroAddress, i)
    // const availableWETH = await revPathV2Read.getTierDistributedAmount(sdk.weth.target, i)
    // const availableUSDC = await revPathV2Read.getTierDistributedAmount(sdk.usdc.target, i)
    // const availableDAI = await revPathV2Read.getTierDistributedAmount(sdk.dai.target, i)

    const tierLimitsETHPromise = revPathV2Read.getTokenTierLimits(ethers.ZeroAddress, i)
    const tierLimitsWETHPromise = revPathV2Read.getTokenTierLimits(sdk.weth.target as string, i)
    const tierLimitsUSDCPromise = revPathV2Read.getTokenTierLimits(sdk.usdc.target as string, i)
    const tierLimitsDAIPromise = revPathV2Read.getTokenTierLimits(sdk.dai.target as string, i)

    const [
      tierLimitsETH,
      tierLimitsWETH,
      tierLimitsUSDC,
      tierLimitsDAI,
    ] = await Promise.all([
      tierLimitsETHPromise,
      tierLimitsWETHPromise,
      tierLimitsUSDCPromise,
      tierLimitsDAIPromise
    ])

    const proportions = {} as { [walletAddress: string]: number }
    const available = {} as { [walletAddress: string]: any }


    for (const wallet of walletList) {
      const p = await revPathV2Read.getRevenueProportion(i, wallet)

      proportions[wallet] =  parseFloat(ethers.formatEther(p))

      // const {
      //   [ethers.ZeroAddress]: ethKey,
      //   [sdk.weth.target]: wethKey
      // } = getTokenListByAddress(_chainId) as any

      // const availableWETH = await withdrawableTiersV2.call(this, { isERC20: 'weth', walletAddress: wallet })
      // const availableUSDC = await withdrawableTiersV2.call(this, { isERC20: 'usdc', walletAddress: wallet })
      // const availableDAI = await withdrawableTiersV2.call(this, { isERC20: 'dai', walletAddress: wallet })

      available[wallet] = {
        [ethers.ZeroAddress]: walletsDistributedETH[i][wallet],
        [sdk.weth.target as string]: walletsDistributedWETH[i][wallet],
        [sdk.usdc.target as string]: walletsDistributedUSDC[i][wallet],
        [sdk.dai.target as string]: walletsDistributedDAI[i][wallet],
      }
    }

    tiers.push({
      walletList,
      isCurrentTier: {
        [ethers.ZeroAddress]: BigInt(i) === currentTierETH,
        [sdk.weth.target as string]: BigInt(i) === currentTierWETH,
        [sdk.usdc.target as string]: BigInt(i) === currentTierUSDC,
        [sdk.dai.target as string]: BigInt(i) === currentTierDAI,
      },
      limits: {
        [ethers.ZeroAddress]: parseFloat(ethers.formatEther(tierLimitsETH)),
        [sdk.weth.target as string]: parseFloat(ethers.formatEther(tierLimitsWETH)),
        [sdk.usdc.target as string]: parseFloat(ethers.formatEther(tierLimitsUSDC)),
        [sdk.dai.target as string]: parseFloat(ethers.formatEther(tierLimitsDAI)),
      },
      proportions,
      available
    })
  }

  return tiers
}
