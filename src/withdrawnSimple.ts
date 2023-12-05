import { ethers } from 'ethers'

import { chainIds, tokenList } from "./constants/tokens"
import { R3vlClient } from './client'
import { withdrawFundsSimple } from './withdrawSimple'

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

  const AddressZero = /* _chainId === chainIds.polygonMumbai || _chainId === chainIds.polygon ? '0x0000000000000000000000000000000000001010' : */ ethers.constants.AddressZero

  const { walletAddress, isERC20 } = payload || { walletAddress: undefined, isERC20: undefined }

  const isTxValid = await withdrawFundsSimple.call(this, { walletAddress: walletAddress ? [walletAddress as string] : [], shouldDistribute: true, isERC20, estimateOnly: true })

  if (isTxValid === -1) return isTxValid

  let released = walletAddress ? await revPathSimpleRead.getTokenWithdrawn(
    isERC20 ? tokenList[isERC20][_chainId] : AddressZero,
    walletAddress
  ) : await revPathSimpleRead.getTotalTokenReleased(isERC20 ? tokenList[isERC20][_chainId] : AddressZero)

  if (isERC20) {
    const decimals = await (sdk as any)[isERC20].decimals()

    released = ethers.utils.parseEther(ethers.utils.formatUnits(released.toString(), decimals))
  }

  const pF: any = await revPathSimpleRead.getGasFee()

  const fee = (pF.toNumber() / 10000000)

  const result = pF.toNumber() > 0 ? parseFloat(ethers.utils.formatEther(released)) + parseFloat(ethers.utils.formatEther(released)) * fee : parseFloat(ethers.utils.formatEther(released))

  return result
}
