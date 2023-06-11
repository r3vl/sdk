import { ethers } from 'ethers'

import { chainIds, tokenList } from "./constants/tokens"
import { R3vlClient } from './client'

export type FnArgs = {
  walletAddress?: string
  isERC20?: keyof typeof tokenList
  blockNumber?: number
}

/**
 *  V0
 */
export async function withdrawnFundsSimple(this: R3vlClient, payload?: FnArgs) {
  const { revPathSimpleRead, _chainId, sdk } = this

  if (!revPathSimpleRead || !sdk) throw new Error("ERROR:")

  const AddressZero = _chainId === chainIds.polygonMumbai || _chainId === chainIds.polygon ? '0x0000000000000000000000000000000000001010' : ethers.constants.AddressZero

  const { walletAddress, isERC20 } = payload || { walletAddress: undefined, isERC20: undefined }

  try {
    let released = walletAddress ? await revPathSimpleRead.getTokenWithdrawn(
      isERC20 ? tokenList[isERC20][_chainId] : AddressZero,
      walletAddress
    ) : await revPathSimpleRead.getTotalTokenReleased(isERC20 ? tokenList[isERC20][_chainId] : AddressZero)

    if (isERC20) {
      const decimals = await (sdk as any)[isERC20].decimals()
  
      released = ethers.utils.parseEther(ethers.utils.formatUnits(released.toString(), decimals))
    }

    const result = parseFloat(ethers.utils.formatEther(released))

    return result
  } catch (error) {
    console.error(error)
  }
}
