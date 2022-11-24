import { BigNumberish, ethers } from 'ethers'
import { updateRevenueTierV1 } from './updateRevenueTierV1'
import { PathLibraryV1__factory } from './typechain'


export const addRevenueTierV1 = async (
  signer: ethers.Signer,
  revPathAddress: string,
  walletList: string[][], 
  distribution: number[][], 
  newAddedTierLimits: number[], 
  finalFundWalletList: string[],
  finalFundDistribution: number[],
  finalFundIndex: number,
) => {
  const contract = PathLibraryV1__factory.connect(revPathAddress, signer)

  const tierLimits = [ethers.utils.parseEther(newAddedTierLimits[0].toString()), ...newAddedTierLimits.slice(0, -1).reverse()]
  .map(num => ethers.utils.parseEther(num.toString()),)

  // new added wallets slice(1) & final fund wallets
  const addedWalletList = [...walletList.slice(1), finalFundWalletList]

  // new added distribution slice(1) & final fund distribution
  const addedDistribution = [...distribution.slice(1), finalFundDistribution]

  try {
    const tx = await contract.addRevenueTier(
      addedWalletList,
      addedDistribution, 
      tierLimits,
      {
        gasLimit: 900000,
      }
    )

    const result = await tx?.wait()

    if(result.status === 1) {
      updateRevenueTierV1( 
        signer,
        revPathAddress,
        walletList[0],
        distribution[0], 
        newAddedTierLimits[0],
        finalFundIndex
      )
    }

    return result

  } catch (error) {
    console.error(error, 'addRevenueTierV1 Error')
  }
}