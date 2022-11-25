import { ethers } from 'ethers'
import { PathLibraryV1__factory } from './typechain'

/**
 *  V1
 */
export const updateRevenueTierV1 = async (
  signer: ethers.Signer,
  revPathAddress: string,
  walletList: string[],
  distribution: number[], 
  tierLimit: number,
  tierNumber: number,
) => {
  const contract = PathLibraryV1__factory.connect(revPathAddress, signer)

  const formatedTierLimit = ethers.utils.parseEther(tierLimit.toString())
  const formatedDistribution = distribution.map(item => Number(ethers.utils.parseUnits(item.toString(), 5).toString()))

  try {
    const tx = await contract.updateRevenueTier(
      walletList,
      formatedDistribution, 
      formatedTierLimit,
      tierNumber,
      {
        gasLimit: 900000,
      }
    )

    const result = await tx?.wait()

    console.log(result, 'updateRevenueTierV1 Result');

    return result

  } catch (error) {
    console.error(error, 'updateRevenueTierV1 Error')
  }
}