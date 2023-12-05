import { ethers } from 'ethers'
import { R3vlClient } from './client'

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
  const { revPathV2FinalWrite, _revPathAddress, apiSigner } = this
  const revPathMetadata = JSON.parse(localStorage.getItem(`r3vl-metadata-${_revPathAddress}`) || "")

  if (!revPathV2FinalWrite) return

  const formatedDistribution = distribution.map(item => {
     return item.map(el => {
      return Number(ethers.utils.parseUnits(el.toString(), 5).toString())
     })
  })

  revPathMetadata.distribution = revPathMetadata.distribution.map((d: number[]) => {
    return d.map((_d: number) => (_d * 100000).toFixed(0))
  })

  try {
    const { customToken } = await apiSigner?.authWallet() || { customToken: null }

    const tx = await revPathV2FinalWrite.updateRevenueTiers(
      revPathMetadata.walletList,
      revPathMetadata.distribution,
      walletList,
      formatedDistribution, 
      tierNumbers
    )

    await apiSigner?.signUpdateRevenuePath({
      address: _revPathAddress || "",
      walletList,
      distribution
    }, customToken)

    const result = await tx.wait()
    
    return result
  } catch (error) {
    console.error(error, 'updateRevenueTiersV2 Error')
  }
}
