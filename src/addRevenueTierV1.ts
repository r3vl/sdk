import { ethers } from 'ethers'
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

  const tierLimits = [newAddedTierLimits[0], ...newAddedTierLimits.slice(1).reverse()]
  .map(num => ethers.utils.parseEther(num.toString()))

  // new added wallets slice(1) & final fund wallets
  const addedWalletList = [...walletList.slice(1), finalFundWalletList]

  // new added distribution slice(1) & final fund distribution
  const addedDistribution = [...distribution.slice(1), finalFundDistribution].map(item => {
    return item.map(el => Number(ethers.utils.parseUnits(el.toString(), 5).toString()))
  })
  
  try {
    const addTx = await contract.addRevenueTier(
      addedWalletList,
      addedDistribution, 
      tierLimits,
      {
        gasLimit: 900000,
      }
    )

    const addedResult = await addTx?.wait()

    console.log(addedResult, 'addedResult'); 

    let finalResult;

    if(addedResult.status === 1) {
      finalResult = await updateRevenueTierV1( 
        signer,
        revPathAddress,
        walletList[0],
        distribution[0], 
        newAddedTierLimits[0],
        finalFundIndex
      )
    }

    if(finalResult?.status === 1) {
      console.error('addRevenueTier Success')

      return finalResult
    } else {
      console.error('addRevenueTier Fail')
    }

  } catch (error) {
    console.error(error, 'addRevenueTierV1 Error')
  }
}