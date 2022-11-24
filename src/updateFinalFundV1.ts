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
  const trx = await updateRevenueTierV1(
    signer,
    revPathAddress,
    walletList,
    distribution,
    0,
    tierNumber
  )

  if(trx?.status === 1) {
    console.log('updateFinalFund success');
    
    updateErc20Distribution(signer, revPathAddress, walletList, distribution)
  } else {
    console.log('updateFinalFund error');
  }

}