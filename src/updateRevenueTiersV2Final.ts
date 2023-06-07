import { ethers } from 'ethers'
import { R3vlClient } from './client'
import axios from 'axios'

export type FnArgs = {
  walletList: string[][],
  distribution: number[][], 
  tierNumbers: number[],
}

/**
 *  V2
 */
export async function updateRevenueTiersV2Final(
  this: R3vlClient, 
  {
    walletList,
    distribution,
    tierNumbers
  } : FnArgs
) {
  const { revPathV2FinalWrite, _revPathAddress, signUpdateRevenuePath } = this
  const revPathMetadata = JSON.parse(localStorage.getItem(`r3vl-metadata-${_revPathAddress}`) || "")

  if (!revPathV2FinalWrite) return

  const formatedDistribution = distribution.map(item => {
     return item.map(el => {
      return Number(ethers.utils.parseUnits(el.toString(), 5).toString())
     })
  }) 

  try {
    const tx = await revPathV2FinalWrite.updateRevenueTiers(
      revPathMetadata.walletList,
      revPathMetadata.distribution,
      walletList,
      formatedDistribution, 
      tierNumbers
    )

    tx.wait().then(async () => {
      await signUpdateRevenuePath({
        address: _revPathAddress || "",
        walletList,
        distribution
      })
    })

    const result = tx
    
    return result
  } catch (error) {
    console.error(error, 'updateRevenueTiersV2 Error')
  }
}
