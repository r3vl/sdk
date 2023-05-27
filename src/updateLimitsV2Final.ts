import { BigNumberish, constants, utils } from 'ethers'
import { tokenList } from './constants/tokens';
import { R3vlClient } from './client'

export type FnArgs = {
  tokens: string[],
  newLimits: number[], 
  tier: number,
}

/**
 *  V2
 */
export async function updateLimitsV2Final(
  this: R3vlClient, 
  {
    tokens,
    newLimits,
    tier
  } : FnArgs
) {
  const { revPathV2FinalWrite, sdk, _chainId } = this
  
  if (!revPathV2FinalWrite || !sdk) return

  const formatedLimits: BigNumberish[] = []
  const formatedTokens: string[] = []

  tokens.forEach((item, index) => {
    switch (item) {
      case 'eth': {
        formatedLimits.push(utils.parseEther(newLimits[index].toString()))
        formatedTokens.push(constants.AddressZero)
        break
      }
      case 'weth': {
        formatedLimits.push(utils.parseUnits(newLimits[index].toString()))
        formatedTokens.push(tokenList.weth[_chainId])
        break
      }
      case 'usdc': {
        formatedLimits.push(utils.parseUnits(newLimits[index].toString()))
        formatedTokens.push(tokenList.usdc[_chainId])
        break
      }
      case 'dai': {
        formatedLimits.push(utils.parseUnits(newLimits[index].toString(), 18))
        formatedTokens.push(tokenList.dai[_chainId])
        break
      }
    } 
  })

  try {
    const tx = await revPathV2FinalWrite.updateLimits(
      formatedTokens,
      formatedLimits, 
      tier,
    )

    const result = await tx?.wait()

    console.log(result, 'updateLimitsV2 Result');
    
    return result
  } catch (error) {
    console.error(error, 'updateLimitsV2 Error')
  }
}
