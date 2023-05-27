
import { GaslessOpts, R3vlClient } from './client'
import { AddressInput } from './react'

/**
 *  V2
 */
export async function transferOwnershipV2Final(this: R3vlClient, newOwner: AddressInput, opts?: GaslessOpts) {
  const { revPathV2FinalWrite, relay, _chainId, _revPathAddress } = this

  if (!revPathV2FinalWrite) return false

  try {
    if (opts?.isGasLess && relay?.signatureCall) {
      // const { data } = await revPathV2Write.populateTransaction.setTrustedForwarder("0xb539068872230f20456CF38EC52EF2f91AF4AE49")
      const { data } = await revPathV2FinalWrite.populateTransaction.transferOwnership(newOwner)

      const request = {
        chainId: _chainId,
        target: _revPathAddress,
        data: data as any
      };

      // send relayRequest to Gelato Relay API
      const relayResponse = await relay?.signatureCall(request, opts.gasLessKey)

      return relayResponse
    }

    const tx = await revPathV2FinalWrite.transferOwnership(newOwner)

    const result = await tx?.wait()

    return result
  } catch (error) {
    console.error(error)
  }
}
