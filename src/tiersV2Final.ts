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

  const AddressZero = _chainId === chainIds.polygonMumbai || _chainId === chainIds.polygon ? '0x0000000000000000000000000000000000001010' : ethers.constants.AddressZero

  const tiersNumber = await revPathV2FinalRead.getTotalRevenueTiers()
  const currentTierETHPromise = revPathV2FinalRead.getCurrentTier(AddressZero)
  const currentTierWETHPromise = revPathV2FinalRead.getCurrentTier(sdk.weth.address)
  const currentTierUSDCPromise = revPathV2FinalRead.getCurrentTier(sdk.usdc.address)
  const currentTierDAIPromise = revPathV2FinalRead.getCurrentTier(sdk.dai.address)
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

  const walletsDistributedETH =_walletsDistributedETH.value || []
  const walletsDistributedWETH = _walletsDistributedWETH.value || []
  const walletsDistributedUSDC = _walletsDistributedUSDC.value || []
  const walletsDistributedDAI = _walletsDistributedDAI.value || []

  for (let i = 0; i < tiersNumber?.toNumber(); i++) {
    const walletList = (revPathMetadata?.walletList[i] || []) as string[]

    // const availableETH = await revPathV2FinalRead.getTierDistributedAmount(AddressZero, i)
    // const availableWETH = await revPathV2FinalRead.getTierDistributedAmount(sdk.weth.address, i)
    // const availableUSDC = await revPathV2FinalRead.getTierDistributedAmount(sdk.usdc.address, i)
    // const availableDAI = await revPathV2FinalRead.getTierDistributedAmount(sdk.dai.address, i)

    const tierLimitsETHPromise = revPathV2FinalRead.getTokenTierLimits(AddressZero, i)
    const tierLimitsWETHPromise = revPathV2FinalRead.getTokenTierLimits(sdk.weth.address, i)
    const tierLimitsUSDCPromise = revPathV2FinalRead.getTokenTierLimits(sdk.usdc.address, i)
    const tierLimitsDAIPromise = revPathV2FinalRead.getTokenTierLimits(sdk.dai.address, i)

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

      proportions[wallet] =  parseFloat(ethers.utils.formatEther(p))

      // const {
      //   [AddressZero]: ethKey,
      //   [sdk.weth.address]: wethKey
      // } = getTokenListByAddress(_chainId) as any

      // const availableWETH = await withdrawableTiersV2.call(this, { isERC20: 'weth', walletAddress: wallet })
      // const availableUSDC = await withdrawableTiersV2.call(this, { isERC20: 'usdc', walletAddress: wallet })
      // const availableDAI = await withdrawableTiersV2.call(this, { isERC20: 'dai', walletAddress: wallet })

      available[wallet] = {
        [AddressZero]: walletsDistributedETH[i] ? walletsDistributedETH[i][wallet] : 0,
        [sdk.weth.address]: walletsDistributedWETH[i] ? walletsDistributedWETH[i][wallet] : 0,
        [sdk.usdc.address]: walletsDistributedUSDC[i] ? walletsDistributedUSDC[i][wallet] : 0,
        [sdk.dai.address]: walletsDistributedDAI[i] ? walletsDistributedDAI[i][wallet] : 0,
      }
    }

    tiers.push({
      walletList,
      isCurrentTier: {
        [AddressZero]: i === currentTierETH?.toNumber(),
        [sdk.weth.address]: i === currentTierWETH?.toNumber(),
        [sdk.usdc.address]: i === currentTierUSDC?.toNumber(),
        [sdk.dai.address]: i === currentTierDAI?.toNumber(),
      },
      limits: {
        [AddressZero]: parseFloat(ethers.utils.formatEther(tierLimitsETH)),
        [sdk.weth.address]: parseFloat(ethers.utils.formatEther(tierLimitsWETH)),
        [sdk.usdc.address]: parseFloat(ethers.utils.formatEther(tierLimitsUSDC)),
        [sdk.dai.address]: parseFloat(ethers.utils.formatEther(tierLimitsDAI)),
      },
      proportions,
      available
    })
  }

  return tiers
}
