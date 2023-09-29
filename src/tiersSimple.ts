import { ethers } from 'ethers'

import { GeneralOpts, R3vlClient } from './client'
import { chainIds, getTokenListByAddress } from './constants/tokens'
import { parseWalletTier } from './withdrawableSimple'
import { withdrawableTiersSimple } from './withdrawableSimple'


export type TierType = {
  walletList: string[]
  available: { [x: string]: number }
  proportions: { [x: string]: number }
}

/**
 *  Simple
 */
export async function tiersSimple(this: R3vlClient, opts?: GeneralOpts): Promise<TierType[] | undefined> {
  const { revPathSimpleRead, sdk, _revPathAddress, _chainId } = this
  const _context = this
  const revPathMetadata = opts?.revPathMetadata ? opts?.revPathMetadata : JSON.parse(localStorage.getItem(`r3vl-metadata-${_revPathAddress}`) || "")

  if (!revPathSimpleRead || !sdk) throw new Error("ERROR:.")

  const AddressZero = _chainId === chainIds.polygonMumbai || _chainId === chainIds.polygon ? '0x0000000000000000000000000000000000001010' : ethers.constants.AddressZero

  const tiersNumber = 1
  const tiers = []
  
  const walletsDistributedETHPromise = withdrawableTiersSimple.call(_context)
  const walletsDistributedWETHPromise = withdrawableTiersSimple.call(_context, { isERC20: 'weth' })
  const walletsDistributedUSDCPromise = withdrawableTiersSimple.call(_context, { isERC20: 'usdc' })
  const walletsDistributedDAIPromise = withdrawableTiersSimple.call(_context, { isERC20: 'dai' })

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

    const proportions = {} as { [walletAddress: string]: number }
    const available = {} as { [walletAddress: string]: any }


    for (const wallet of walletList) {
      const p = parseWalletTier(revPathMetadata, i, walletList.indexOf(wallet)).proportion

      proportions[wallet] =  parseFloat(ethers.utils.formatEther(p))

      available[wallet] = {
        [AddressZero]: walletsDistributedETH[i][wallet],
        [sdk.weth.address]: walletsDistributedWETH[i][wallet],
        [sdk.usdc.address]: walletsDistributedUSDC[i][wallet],
        [sdk.dai.address]: walletsDistributedDAI[i][wallet],
      }
    }

    tiers.push({
      walletList,
      proportions,
      available
    })
  }

  return tiers
}
