import { ContractTransaction, ethers } from 'ethers'

import { tokenList } from "./constants/tokens"
import { R3vlClient } from './client'
import { increaseGasLimit } from './createRevenuePathV2'

export type FnArgs = {
  walletAddress: string[]
  shouldDistribute?: boolean
  isERC20?: keyof typeof tokenList
  onTxCreated?: (tx: ContractTransaction) => void
}

/**
 *  V2
 */
export async function withdrawFundsV2Final(this: R3vlClient, { walletAddress, shouldDistribute = true, isERC20, onTxCreated }: FnArgs) {
  const { revPathV2FinalWrite, _chainId, _revPathAddress } = this
  const revPathMetadata = JSON.parse(localStorage.getItem(`r3vl-metadata-${_revPathAddress}`) || "")

  if (!revPathV2FinalWrite) return false

  try {
    let tx

    revPathMetadata.distribution = revPathMetadata.distribution.map((d: number[]) => {
      return d.map((_d: number) => _d * 100000)
    })

    if (walletAddress) {
      if (isERC20) {
        const gasLimit = increaseGasLimit(await revPathV2FinalWrite.estimateGas.release(tokenList[isERC20][_chainId], walletAddress, revPathMetadata.walletList, revPathMetadata.distribution, shouldDistribute))

        tx = await revPathV2FinalWrite.release(tokenList[isERC20][_chainId], walletAddress, revPathMetadata.walletList, revPathMetadata.distribution, shouldDistribute, { gasLimit })
      } else {
        console.log("RELEASE::", ethers.constants.AddressZero, walletAddress, revPathMetadata.walletList, revPathMetadata.distribution, shouldDistribute)

        const gasLimit = increaseGasLimit(await revPathV2FinalWrite.estimateGas.release(ethers.constants.AddressZero, walletAddress, revPathMetadata.walletList, revPathMetadata.distribution, shouldDistribute))

        tx = await revPathV2FinalWrite.release(ethers.constants.AddressZero, walletAddress, revPathMetadata.walletList, revPathMetadata.distribution, shouldDistribute, { gasLimit })
      }
    } else {
      tx = await revPathV2FinalWrite.distributePendingTokens(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero, revPathMetadata.walletList, revPathMetadata.distribution)
    }

    onTxCreated && tx && onTxCreated(tx)

    const result = await tx?.wait()
    const [event] = result?.events || [{ args: [] }]

    return event?.args && ethers.utils.formatEther(event?.args[1])
  } catch (error) {
    console.error(error)
  }
}

// export async function withdrawFundsGasLessV2(this: R3vlClient, { walletAddress, isERC20 }: FnArgs, opts: { gasLessKey: string }) {
//   const { revPathV2Write, _chainId, relay } = this

//   if (!revPathV2Write) return false

//   try {
//     let tx 

//     if (walletAddress) {
//       if (isERC20) {
//         tx = await revPathV2Write.populateTransaction.release(tokenList[isERC20][_chainId], walletAddress)
//       } else {
//         tx = await revPathV2Write.populateTransaction.release(ethers.constants.AddressZero, walletAddress)
//       }
//     } else {
//       tx = await revPathV2Write.populateTransaction.distributePendingTokens(isERC20 ? tokenList[isERC20][_chainId] : ethers.constants.AddressZero)
//     }

//     const request = {
//       chainId: _chainId,
//       target: revPathV2Write.address,
//       data: tx
//     };

//     const relayResponse = await relay?.signatureCall(request, opts.gasLessKey)

//     return relayResponse
//   } catch (error) {
//     console.error(error)
//   }
// }
