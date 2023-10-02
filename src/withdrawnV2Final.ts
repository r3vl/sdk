import { ethers } from 'ethers'

import { chainIds, tokenList } from "./constants/tokens"
import { R3vlClient } from './client'
import { withdrawFundsV2Final } from './withdrawV2Final'

export type FnArgs = {
  walletAddress?: string
  isERC20?: keyof typeof tokenList
  blockNumber?: number
}

/**
 *  V0
 */
export async function withdrawnFundsV2Final(this: R3vlClient, payload?: FnArgs) {
  const { revPathV2FinalRead, _chainId, sdk } = this

  if (!revPathV2FinalRead || !sdk) throw new Error("ERROR:")

  const AddressZero = /* _chainId === chainIds.polygonMumbai || _chainId === chainIds.polygon ? '0x0000000000000000000000000000000000001010' : */ ethers.ZeroAddress

  const { walletAddress, isERC20 } = payload || { walletAddress: undefined, isERC20: undefined }

  const isTxValid = await withdrawFundsV2Final.call(this, { walletAddress: [walletAddress as string], shouldDistribute: true, isERC20, estimateOnly: true })

  if (isTxValid === -1) return isTxValid

  let released = walletAddress ? await revPathV2FinalRead.getTokenWithdrawn(
    isERC20 ? tokenList[isERC20][_chainId] : AddressZero,
    walletAddress
  ) : await revPathV2FinalRead.getTotalTokenReleased(isERC20 ? tokenList[isERC20][_chainId] : AddressZero)

  if (isERC20) {
    const decimals = await (sdk as any)[isERC20].decimals()

    released = ethers.parseEther(ethers.formatUnits(released.toString(), decimals))
  }

  const isFeeRequired = await revPathV2FinalRead.getFeeRequirementStatus()

  const pF = await revPathV2FinalRead.getPlatformFee()
  const fee = (pF / BigInt(10000000))

  const result = isFeeRequired || pF > 0 ? BigInt(parseFloat(ethers.formatEther(released))) + BigInt(parseFloat(ethers.formatEther(released))) * fee : parseFloat(ethers.formatEther(released))

  return result
}
