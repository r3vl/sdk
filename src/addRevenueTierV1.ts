import { ethers } from 'ethers'
import { updateRevenueTierV1 } from './updateRevenueTierV1'
import { R3vlClient } from './client'

export type AddRevenueTierV1Args = {
  walletList: string[][], 
  distribution: number[][], 
  newAddedTierLimits: number[], 
  finalFundWalletList: string[],
  finalFundDistribution: number[],
  finalFundIndex: number,
}

export async function addRevenueTierV1 (
  this: R3vlClient, 
  { 
    walletList,
    distribution,
    newAddedTierLimits,
    finalFundWalletList,
    finalFundDistribution,
    finalFundIndex
  } : AddRevenueTierV1Args
) {
  const { revPathV1Write, sdk } = this

  if (!revPathV1Write || !sdk) return

  const tierLimits = [newAddedTierLimits[0], ...newAddedTierLimits.slice(1).reverse()]
  .map(num => ethers.parseEther(num.toString()))

  // new added wallets slice(1) & final fund wallets
  const addedWalletList = [...walletList.slice(1), finalFundWalletList]

  // new added distribution slice(1) & final fund distribution
  const addedDistribution = [...distribution.slice(1), finalFundDistribution].map(item => {
    return item.map(el => Number(ethers.parseUnits(el.toString(), 5).toString()))
  })
  
  try {
    const addTx = await revPathV1Write.addRevenueTier(
      addedWalletList,
      addedDistribution, 
      tierLimits,
    )

    const addedResult = await addTx?.wait()

    console.log(addedResult, 'addedResult'); 

    let finalResult;

    if (addedResult?.status === 1) {
      finalResult = await updateRevenueTierV1.call(this, 
       { 
        walletList: walletList[0],
        distribution: distribution[0], 
        tierLimit: newAddedTierLimits[0],
        tierNumber: finalFundIndex
      })
    }
    
    // if(finalResult?.status === 1) {
    //   console.error('addRevenueTier Success')
    // } else {
    //   console.error('addRevenueTier Fail')
    // }

    return finalResult

  } catch (error) {
    console.error(error, 'addRevenueTierV1 Error')
  }
}
