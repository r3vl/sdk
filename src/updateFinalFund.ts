import { ethers } from 'ethers'
import { updateErc20Distribution } from './updateErc20Distribution'
import { updateRevenueTierV1 } from './updateRevenueTierV1'


export const updateFinalFund = async (
  signer: ethers.Signer,
  revPathAddress: string,
  walletList: string[],
  distribution: number[], 
  tierNumber: number,
) => {
  const updateRevenueTierResult = await updateRevenueTierV1(
    signer,
    revPathAddress,
    walletList,
    distribution,
    0,
    tierNumber
  )

  if(updateRevenueTierResult?.status === 1) {
    const updateErc20Result = await updateErc20Distribution(signer, revPathAddress, walletList, distribution)

    if(updateErc20Result?.status === 1) {
      console.log('updateFinalFund success');
    } else {
      console.log('updateFinalFund fail');
    }

  } else {
    console.log('updateFinalFund error');
  }

}