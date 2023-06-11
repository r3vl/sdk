import { ethers } from 'ethers'
import { R3vlClient } from './client'

export type FnArgs = {
  walletList: string[][],
  distribution: number[][], 
}

/**
 *  V2
 */
export async function updateRevenueTiersSimple(
  this: R3vlClient, 
  {
    walletList,
    distribution,
  } : FnArgs
) {
  const { revPathSimpleWrite, _revPathAddress, apiSigner } = this

  if (!revPathSimpleWrite) return

  const formatedDistribution = distribution.map(item => {
     return item.map(el => {
      return Number(ethers.utils.parseUnits(el.toString(), 5).toString())
     })
  }) 

  try {
    const tx = await revPathSimpleWrite.updateRevenueTiers(
      walletList[0],
      formatedDistribution[0],
    )

    const { customToken } = await apiSigner?.authWallet() || { customToken: null }
    
    await apiSigner?.signUpdateRevenuePath({
      address: _revPathAddress || "",
      walletList,
      distribution
    }, customToken)

    const result = await tx.wait()
    
    return result
  } catch (error) {
    console.error(error, 'updateRevenueTiersSimple Error')
  }
}
