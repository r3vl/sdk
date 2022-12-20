import { ethers } from 'ethers'
import { R3vlClient } from './client'

export type UpdateErc20DistributionArgs = {
  walletList: string[],
  distribution: number[], 
}

export async function updateErc20Distribution (
  this: R3vlClient, 
  { 
    walletList,
    distribution,
  } : UpdateErc20DistributionArgs
) {
  const { revPathV1, sdk } = this

  if (!revPathV1 || !sdk) return

  const formatedDistribution = distribution.map(item => Number(ethers.utils.parseUnits(item.toString(), 5).toString()))

  try {
    const tx = await revPathV1.updateErc20Distribution(
      walletList,
      formatedDistribution, 
      {
        gasLimit: 900000,
      }
    )

    const result = await tx?.wait()

    console.log(result, 'updateErc20Distribution Result');

    return result

  } catch (error) {
    console.error(error, 'updateErc20Distribution Error')
  }
}