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
  const { revPathV1Write, sdk } = this

  if (!revPathV1Write || !sdk) return

  const formatedDistribution = distribution.map(item => Number(ethers.parseUnits(item.toString(), 5).toString()))

  try {
    const tx = await revPathV1Write.updateErc20Distribution(
      walletList,
      formatedDistribution, 
    )

    const result = await tx?.wait()

    console.log(result, 'updateErc20Distribution Result');

    return result

  } catch (error) {
    console.error(error, 'updateErc20Distribution Error')
  }
}
