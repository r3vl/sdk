import { updateErc20Distribution } from './updateErc20Distribution'
import { updateRevenueTierV1, UpdateRevenueTierV1Args } from './updateRevenueTierV1'
import { R3vlClient } from './client'

export type UpdateFinalFundArgs = {
  walletList: string[],
  distribution: number[], 
  tierNumber: number,
}

export async function updateFinalFund (
  this: R3vlClient, 
  { 
    walletList,
    distribution,
    tierNumber
  } : UpdateFinalFundArgs
) {

  const updateRevenueTierV1Args: UpdateRevenueTierV1Args = {
    walletList,
    distribution,
    tierLimit: 0,
    tierNumber
  }

  const { revPathV1Write, sdk } = this

  if (!revPathV1Write || !sdk) return

  const updateRevenueTierResult = await updateRevenueTierV1.call(this, updateRevenueTierV1Args)

  if (updateRevenueTierResult && updateRevenueTierResult.status === 1) {
    const updateErc20Result = await updateErc20Distribution.call(this, { walletList, distribution })

    if (updateErc20Result && updateErc20Result?.status === 1) {
      console.log('updateFinalFund success');
    } else {
      console.log('updateFinalFund fail');
    }
  } else {
    console.log('updateFinalFund error');
  }
}
