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
  const currentTierETH = await revPathV2Read.getCurrentTier(ethers.constants.AddressZero)
  const currentTierWETH = await revPathV2Read.getCurrentTier(sdk.weth.address)
  const currentTierUSDC = await revPathV2Read.getCurrentTier(sdk.usdc.address)
  const currentTierDAI = await revPathV2Read.getCurrentTier(sdk.dai.address)
  const tiers = []
  
  const walletsDistributedETH = await withdrawableTiersV2.call(_context)
  const walletsDistributedWETH = await withdrawableTiersV2.call(_context, { isERC20: 'weth' })
  const walletsDistributedUSDC = await withdrawableTiersV2.call(_context, { isERC20: 'usdc' })
  const walletsDistributedDAI = await withdrawableTiersV2.call(_context, { isERC20: 'dai' })

  for (let i = 0; i < tiersNumber?.toNumber(); i++) {
    const walletList = await revPathV2Read.getRevenueTier(i)

    // const availableETH = await revPathV2Read.getTierDistributedAmount(ethers.constants.AddressZero, i)
    // const availableWETH = await revPathV2Read.getTierDistributedAmount(sdk.weth.address, i)
    // const availableUSDC = await revPathV2Read.getTierDistributedAmount(sdk.usdc.address, i)
    // const availableDAI = await revPathV2Read.getTierDistributedAmount(sdk.dai.address, i)

    const tierLimitsETH = await revPathV2Read.getTokenTierLimits(ethers.constants.AddressZero, i)
    const tierLimitsWETH = await revPathV2Read.getTokenTierLimits(sdk.weth.address, i)
    const tierLimitsUSDC = await revPathV2Read.getTokenTierLimits(sdk.usdc.address, i)
    const tierLimitsDAI = await revPathV2Read.getTokenTierLimits(sdk.dai.address, i)

    const proportions = {} as { [walletAddress: string]: number }
    const available = {} as { [walletAddress: string]: any }


    for (const wallet of walletList) {
      const p = await revPathV2Read.getRevenueProportion(i, wallet)

      proportions[wallet] =  parseFloat(ethers.utils.formatEther(p))

      // const {
      //   [ethers.constants.AddressZero]: ethKey,
      //   [sdk.weth.address]: wethKey
      // } = getTokenListByAddress(_chainId) as any

      // const availableWETH = await withdrawableTiersV2.call(this, { isERC20: 'weth', walletAddress: wallet })
      // const availableUSDC = await withdrawableTiersV2.call(this, { isERC20: 'usdc', walletAddress: wallet })
      // const availableDAI = await withdrawableTiersV2.call(this, { isERC20: 'dai', walletAddress: wallet })

      available[wallet] = {
        [ethers.constants.AddressZero]: walletsDistributedETH[i][wallet],
        [sdk.weth.address]: walletsDistributedWETH[i][wallet],
        [sdk.usdc.address]: walletsDistributedUSDC[i][wallet],
        [sdk.dai.address]: walletsDistributedDAI[i][wallet],
      }
    }

    tiers.push({
      walletList,
      isCurrentTier: {
        [ethers.constants.AddressZero]: i === currentTierETH?.toNumber(),
        [sdk.weth.address]: i === currentTierWETH?.toNumber(),
        [sdk.usdc.address]: i === currentTierUSDC?.toNumber(),
        [sdk.dai.address]: i === currentTierDAI?.toNumber(),
      },
      limits: {
        [ethers.constants.AddressZero]: parseFloat(ethers.utils.formatEther(tierLimitsETH)),
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
