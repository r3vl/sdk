import { getGoerliSdk } from '@dethcrypto/eth-sdk-client' // yay, our SDK! It's tailored especially for our needs
import { communitySigner } from './utils';
import { ethers } from 'ethers'

/**
 *  V1
 */
export const createRevenuePathV1 = async (
  walletList: string[][],
  distribution: number[][], 
  tierLimits: number[],
  name: string,
  mutabilityEnabled: boolean
) => {
  const signer = communitySigner()
  const sdk = getGoerliSdk(signer);
  const contract = sdk.reveelMain;

  const formatedTierLimits = tierLimits.map(limit => ethers.utils.parseEther(limit.toString()).toString())

  const formatedDistribution = distribution.map(item => {
     return item.map(el => {
      return Number(ethers.utils.parseUnits(el.toString(), 5).toString())
     })
  }) 


  try {
    const tx = await contract.createRevenuePath(
      walletList,
      formatedDistribution, 
      formatedTierLimits,
      name,
      mutabilityEnabled,
      {
        gasLimit: 900000,
      }
    )

    const result = await tx?.wait()

    console.log(result, 'createRevenuePathV1 Result');
    
    return result
  } catch (error) {
    console.error(error, 'createRevenuePathV1 Error')
  }
}