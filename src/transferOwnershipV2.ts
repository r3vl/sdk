
import { R3vlClient } from './client'
import { AddressInput } from './react'

/**
 *  V2
 */
export async function transferOwnershipV2(this: R3vlClient, newOwner: AddressInput) {
  const { revPathV2Write, _chainId } = this

  if (!revPathV2Write) return false

  try {
    const tx = await revPathV2Write.transferOwnership(newOwner)

    const result = await tx?.wait()

    return result
  } catch (error) {
    console.error(error)
  }
}
