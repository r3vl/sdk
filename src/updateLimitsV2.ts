import { BigNumberish, ethers, utils } from 'ethers'
import { tokenList } from './constants/tokens';
import { PathLibraryV2__factory } from './typechain'; 
import { getChainId } from './utils';

/**
 *  V2
 */
export const updateLimitsV2 = async (
  signer: ethers.Signer,
  address: string,
  tokens: string[],
  newLimits: number[], 
  tier: number,
) => {
  const contract = PathLibraryV2__factory.connect(address, signer)
  const chainId = await getChainId()

  const formatedLimits: BigNumberish[] = []
  const formatedTokens: string[] = []

  tokens.forEach((item, index) => {
    switch (item) {
      case 'eth': {
        formatedLimits.push(utils.parseEther(newLimits[index].toString()))
        formatedTokens.push(tokenList.eth[chainId])
        break
      }
      case 'weth': {
        formatedLimits.push(utils.parseUnits(newLimits[index].toString()))
        formatedTokens.push(tokenList.weth[chainId])
        break
      }
      case 'usdc': {
        formatedLimits.push(utils.parseUnits(newLimits[index].toString()))
        formatedTokens.push(tokenList.usdc[chainId])
        break
      }
      case 'dai': {
        formatedLimits.push(utils.parseUnits(newLimits[index].toString(), 18))
        formatedTokens.push(tokenList.dai[chainId])
        break
      }
    } 
  })

  try {
    const tx = await contract.updateLimits(
      formatedTokens,
      formatedLimits, 
      tier,
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

