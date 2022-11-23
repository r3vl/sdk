import { getGoerliSdk } from '@dethcrypto/eth-sdk-client' // yay, our SDK! It's tailored especially for our needs
import { communitySigner } from './utils';
import { BigNumberish } from 'ethers'

/**
 *  V1
 */
export const createRevenuePathV1 = async (
  walletList: string[][],
  distribution: number[][], 
  tierLimit: BigNumberish[],
  name: string,
  mutabilityEnabled: boolean
) => {
  const signer = communitySigner()
  const sdk = getGoerliSdk(signer);
  const contract = sdk.reveelMain;

  try {
    const tx = await contract.createRevenuePath(
      walletList,
      distribution, 
      tierLimit,
      name,
      mutabilityEnabled,
      {
        gasLimit: 900000,
      }
    )

    const result = await tx?.wait()

    console.log(result, 'createdRevenuePathV1 Result');
    
  } catch (error) {
    console.error(error, 'createRevenuePathV1 Error')
  }
}