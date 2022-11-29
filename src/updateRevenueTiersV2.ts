import { ethers } from 'ethers'
import { PathLibraryV2__factory } from './typechain'; 

/**
 *  V2
 */
export const updateRevenueTiersV2 = async (
  signer: ethers.Signer,
  address: string,
  walletList: string[][],
  distribution: number[][], 
  tierNumbers: number[],
) => {
  const contract = PathLibraryV2__factory.connect(address, signer)

  const formatedDistribution = distribution.map(item => {
     return item.map(el => {
      return Number(ethers.utils.parseUnits(el.toString(), 5).toString())
     })
  }) 

  try {
    const tx = await contract.updateRevenueTiers(
      walletList,
      formatedDistribution, 
      tierNumbers,
      {
        gasLimit: 900000,
      }
    )

    const result = await tx?.wait()

    console.log(result, 'updateRevenueTiersV2 Result');
    
    return result
  } catch (error) {
    console.error(error, 'updateRevenueTiersV2 Error')
  }
}

