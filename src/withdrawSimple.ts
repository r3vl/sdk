import { ContractTransaction, ethers } from 'ethers'

import { chainIds, tokenList } from "./constants/tokens"
import { GaslessOpts, R3vlClient } from './client'
import { increaseGasLimit } from './createRevenuePathV2'

export type FnArgs = {
  walletAddress: string[]
  shouldDistribute?: boolean
  isERC20?: keyof typeof tokenList
  onTxCreated?: (tx: ContractTransaction) => void
  estimateOnly?: boolean
}

/**
 *  V2
 */
export async function withdrawFundsSimple(this: R3vlClient, { walletAddress, shouldDistribute = true, isERC20, onTxCreated, estimateOnly = false }: FnArgs, opts?: GaslessOpts) {
  const { revPathSimpleWrite, _chainId, _revPathAddress, relay } = this
  const revPathMetadata = JSON.parse(localStorage.getItem(`r3vl-metadata-${_revPathAddress}`) || "")

  if (!revPathSimpleWrite) return false

  const AddressZero = /* _chainId === chainIds.polygonMumbai || _chainId === chainIds.polygon ? '0x0000000000000000000000000000000000001010' : */ ethers.ZeroAddress

  try {
    let tx

    revPathMetadata.distribution = revPathMetadata.distribution.map((d: number[]) => {
      return d.map((_d: number) => _d * 100000)
    })

    if (opts?.isGasLess && relay?.signatureCall) {
      let r

      if (walletAddress) {
        if (isERC20) {
          console.log("WITHDRAW/RELEASE_PAYLOAD_GASLESS:::", AddressZero, walletAddress, revPathMetadata.walletList[0], revPathMetadata.distribution[0], shouldDistribute)
  
          r = await revPathSimpleWrite.release.populateTransaction(tokenList[isERC20][_chainId], walletAddress, revPathMetadata.walletList[0], revPathMetadata.distribution[0], shouldDistribute)
        } else {
          console.log("WITHDRAW/RELEASE_PAYLOAD_GASLESS:::", AddressZero, walletAddress, revPathMetadata.walletList[0], revPathMetadata.distribution[0], shouldDistribute)
  
          r = await revPathSimpleWrite.release.populateTransaction(AddressZero, walletAddress, revPathMetadata.walletList[0], revPathMetadata.distribution[0], shouldDistribute)
        }
      } else {
        r = await revPathSimpleWrite.distributePendingTokens.populateTransaction(isERC20 ? tokenList[isERC20][_chainId] : AddressZero, revPathMetadata.walletList[0], revPathMetadata.distribution)
      }

      if (estimateOnly) return

      const request = {
        chainId: _chainId,
        target: revPathSimpleWrite.target,
        data: r.data as any
      };

      const tx = await relay?.signatureCall(request, opts.gasLessKey)

      onTxCreated && tx && onTxCreated(tx)

      const result = await tx?.wait()
      const [event] = result?.events || [{ args: [] }]

      return event?.args && ethers.formatEther(event?.args[1])
    }

    if (walletAddress) {
      if (isERC20) {
        const gasLimit = increaseGasLimit(await revPathSimpleWrite.release.estimateGas(tokenList[isERC20][_chainId], walletAddress, revPathMetadata.walletList[0], revPathMetadata.distribution[0], shouldDistribute))

        if (estimateOnly) return

        tx = await revPathSimpleWrite.release(tokenList[isERC20][_chainId], walletAddress, revPathMetadata.walletList[0], revPathMetadata.distribution[0], shouldDistribute, { gasLimit })
      } else {
        const gasLimit = increaseGasLimit(await revPathSimpleWrite.release.estimateGas(AddressZero, walletAddress, revPathMetadata.walletList[0], revPathMetadata.distribution[0], shouldDistribute))

        if (estimateOnly) return

        tx = await revPathSimpleWrite.release(AddressZero, walletAddress, revPathMetadata.walletList[0], revPathMetadata.distribution[0], shouldDistribute, { gasLimit })
      }
    } else {
      const gasLimit = increaseGasLimit(await revPathSimpleWrite.distributePendingTokens.estimateGas(isERC20 ? tokenList[isERC20][_chainId] : AddressZero, revPathMetadata.walletList[0], revPathMetadata.distribution))

      if (estimateOnly) return

      tx = await revPathSimpleWrite.distributePendingTokens(isERC20 ? tokenList[isERC20][_chainId] : AddressZero, revPathMetadata.walletList[0], revPathMetadata.distribution, { gasLimit })
    }

    onTxCreated && tx && onTxCreated(tx)

    const result = await tx?.wait()
    const [event] = result?.events || [{ args: [] }]

    return event?.args && ethers.formatEther(event?.args[1])
  } catch (error) {
    return -1
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
//         tx = await revPathV2Write.populateTransaction.release(AddressZero, walletAddress)
//       }
//     } else {
//       tx = await revPathV2Write.populateTransaction.distributePendingTokens(isERC20 ? tokenList[isERC20][_chainId] : AddressZero)
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
