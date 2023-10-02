import { ContractTransaction, ethers } from 'ethers'

import { tokenList } from "./constants/tokens"
import { R3vlClient } from './client'
import { increaseGasLimit } from './createRevenuePathV2'

export type FnArgs = {
  walletAddress: string
  isERC20?: keyof typeof tokenList
  onTxCreated?: (tx: ContractTransaction) => void
}

/**
 *  V2
 */
export async function withdrawFundsV2(this: R3vlClient, { walletAddress, isERC20, onTxCreated }: FnArgs) {
  const { revPathV2Write, _chainId } = this

  if (!revPathV2Write) return false

  try {
    let tx 

    if (walletAddress) {
      if (isERC20) {
        const gasLimit = increaseGasLimit(await revPathV2Write.estimateGas.release(tokenList[isERC20][_chainId], walletAddress))

        tx = await revPathV2Write.release(tokenList[isERC20][_chainId], walletAddress, { gasLimit })
      } else {
        const gasLimit = increaseGasLimit(await revPathV2Write.estimateGas.release(ethers.ZeroAddress, walletAddress))

        tx = await revPathV2Write.release(ethers.ZeroAddress, walletAddress, { gasLimit })
      }
    } else {
      tx = await revPathV2Write.distributePendingTokens(isERC20 ? tokenList[isERC20][_chainId] : ethers.ZeroAddress)
    }

    onTxCreated && tx && onTxCreated(tx)

    const result = await tx?.wait()
    const [event] = result?.events || [{ args: [] }]

    return event?.args && ethers.formatEther(event?.args[1])
  } catch (error) {
    console.error(error)
  }
}

export async function withdrawFundsGasLessV2(this: R3vlClient, { walletAddress, isERC20 }: FnArgs, opts: { gasLessKey: string }) {
  const { revPathV2Write, _chainId, relay } = this

  if (!revPathV2Write) return false

  try {
    let tx 

    if (walletAddress) {
      if (isERC20) {
        tx = await revPathV2Write.populateTransaction.release(tokenList[isERC20][_chainId], walletAddress)
      } else {
        tx = await revPathV2Write.populateTransaction.release(ethers.ZeroAddress, walletAddress)
      }
    } else {
      tx = await revPathV2Write.populateTransaction.distributePendingTokens(isERC20 ? tokenList[isERC20][_chainId] : ethers.ZeroAddress)
    }

    const request = {
      chainId: _chainId,
      target: revPathV2Write.address,
      data: tx
    };

    const relayResponse = await relay?.signatureCall(request, opts.gasLessKey)

    return relayResponse
  } catch (error) {
    console.error(error)
  }
}
