import { getGoerliSdk } from '@dethcrypto/eth-sdk-client' // yay, our SDK! It's tailored especially for our needs
import { constants, ethers, utils } from 'ethers'
import { tokenList } from './constants/tokens';
import { getChainId } from './utils'

/**
 *  V2
 */
export const createRevenuePathV2 = async (
  signer: ethers.Signer,
  walletList: string[][],
  distribution: number[][], 
  tierLimits: number[][],
  name: string,
  mutabilityEnabled: boolean
) => {
  const sdk = getGoerliSdk(signer);
  const contract = sdk.reveelMainV2;

  const chainId = await getChainId()

  const formatedTierLimits = tierLimits.map((item, index)  => {
    return item.map(limit => {
      switch (index) {
        case 0: 
          return utils.parseEther(limit.toString())
        case 3: 
          return utils.parseUnits(limit.toString(), 18)
        default:
          return utils.parseUnits(limit.toString())
      }
    })
  })

  const formatedDistribution = distribution.map(item => {
     return item.map(el => {
      return Number(ethers.utils.parseUnits(el.toString(), 5).toString())
     })
  }) 

  const formatedTokenList = [
    constants.AddressZero, 
    tokenList.weth[chainId],
    tokenList.usdc[chainId],
    tokenList.dai[chainId]
  ]

  try {
    const tx = await contract.createRevenuePath(
      walletList,
      formatedDistribution, 
      formatedTokenList,
      formatedTierLimits,
      name,
      mutabilityEnabled,
      {
        gasLimit: 900000,
      }
    )

    const result = await tx?.wait()

    console.log(result, 'createRevenuePathV2 Result');
    
    return result
  } catch (error) {
    console.error(error, 'createRevenuePathV2 Error')
  }
}

