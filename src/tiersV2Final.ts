import { ethers } from 'ethers'

import { GeneralOpts, R3vlClient } from './client'
import { chainIds, getTokenListByAddress } from './constants/tokens'
import { withdrawableTiersV2Final } from './withdrawableV2Final'
import { parseWalletTier } from './withdrawableV2Final'


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
export async function tiersV2Final(this: R3vlClient, opts?: GeneralOpts): Promise<TierType[] | undefined> {
  const { revPathV2FinalRead, sdk, _revPathAddress, _chainId } = this
  const _context = this
  const revPathMetadata = opts?.revPathMetadata ? opts?.revPathMetadata : JSON.parse(localStorage.getItem(`r3vl-metadata-${_revPathAddress}`) || "")

  if (!revPathV2FinalRead || !sdk) throw new Error("ERROR:.")

  const AddressZero = _chainId === chainIds.polygonMumbai || _chainId === chainIds.polygon ? '0x0000000000000000000000000000000000001010' : ethers.ZeroAddress

  const tiersNumber = await revPathV2FinalRead.getTotalRevenueTiers()
  const currentTierETHPromise = revPathV2FinalRead.getCurrentTier(AddressZero)
  const currentTierWETHPromise = revPathV2FinalRead.getCurrentTier(sdk.weth.target as string)
  const currentTierUSDCPromise = revPathV2FinalRead.getCurrentTier(sdk.usdc.target as string)
  const currentTierDAIPromise = revPathV2FinalRead.getCurrentTier(sdk.dai.target as string)
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
  
  const walletsDistributedETHPromise = withdrawableTiersV2Final.call(_context)
  const walletsDistributedWETHPromise = withdrawableTiersV2Final.call(_context, { isERC20: 'weth' })
  const walletsDistributedUSDCPromise = withdrawableTiersV2Final.call(_context, { isERC20: 'usdc' })
  const walletsDistributedDAIPromise = withdrawableTiersV2Final.call(_context, { isERC20: 'dai' })

  const [
    _walletsDistributedETH,
    _walletsDistributedWETH,
    _walletsDistributedUSDC,
    _walletsDistributedDAI,
  ] = (await Promise.allSettled([
    walletsDistributedETHPromise,
    walletsDistributedWETHPromise,
    walletsDistributedUSDCPromise,
    walletsDistributedDAIPromise,
  ])) as any

  const walletsDistributedETH =_walletsDistributedETH.value || 0
  const walletsDistributedWETH = _walletsDistributedWETH.value || 0
  const walletsDistributedUSDC = _walletsDistributedUSDC.value || 0
  const walletsDistributedDAI = _walletsDistributedDAI.value || 0

  for (let i = 0; i < tiersNumber; i++) {
    const walletList = (revPathMetadata?.walletList[i] || []) as string[]

    // const availableETH = await revPathV2FinalRead.getTierDistributedAmount(AddressZero, i)
    // const availableWETH = await revPathV2FinalRead.getTierDistributedAmount(sdk.weth.target as string, i)
    // const availableUSDC = await revPathV2FinalRead.getTierDistributedAmount(sdk.usdc.target as string, i)
    // const availableDAI = await revPathV2FinalRead.getTierDistributedAmount(sdk.dai.target as string, i)

    const tierLimitsETHPromise = revPathV2FinalRead.getTokenTierLimits(AddressZero, i)
    const tierLimitsWETHPromise = revPathV2FinalRead.getTokenTierLimits(sdk.weth.target as string, i)
    const tierLimitsUSDCPromise = revPathV2FinalRead.getTokenTierLimits(sdk.usdc.target as string, i)
    const tierLimitsDAIPromise = revPathV2FinalRead.getTokenTierLimits(sdk.dai.target as string, i)

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
      const p = parseWalletTier(revPathMetadata, i, walletList.indexOf(wallet)).proportion

      proportions[wallet] =  parseFloat(ethers.formatEther(p))

      // const {
      //   [AddressZero]: ethKey,
      //   [sdk.weth.target as string]: wethKey
      // } = getTokenListByAddress(_chainId) as any

      // const availableWETH = await withdrawableTiersV2.call(this, { isERC20: 'weth', walletAddress: wallet })
      // const availableUSDC = await withdrawableTiersV2.call(this, { isERC20: 'usdc', walletAddress: wallet })
      // const availableDAI = await withdrawableTiersV2.call(this, { isERC20: 'dai', walletAddress: wallet })

      available[wallet] = {
        [AddressZero]: walletsDistributedETH[i][wallet],
        [sdk.weth.target as string]: walletsDistributedWETH[i][wallet],
        [sdk.usdc.target as string]: walletsDistributedUSDC[i][wallet],
        [sdk.dai.target as string]: walletsDistributedDAI[i][wallet],
      }
    }

    tiers.push({
      walletList,
      isCurrentTier: {
        [AddressZero]: BigInt(i) === currentTierETH,
        [sdk.weth.target as string]: BigInt(i) === currentTierWETH,
        [sdk.usdc.target as string]: BigInt(i) === currentTierUSDC,
        [sdk.dai.target as string]: BigInt(i) === currentTierDAI,
      },
      limits: {
        [AddressZero]: parseFloat(ethers.formatEther(tierLimitsETH)),
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
