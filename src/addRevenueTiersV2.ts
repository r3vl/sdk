import { ContractReceipt, ethers } from 'ethers' 
import { updateLimitsV2, FnArgs as UpdateLimitsV2Args } from './updateLimitsV2';
import { updateRevenueTiersV2 } from './updateRevenueTiersV2';
import { R3vlClient } from './client'

export type FnArgs = {
  walletList: string[][],
  distribution: number[][], 
  tiers: { token: string, limits: number[] }[],
  finalFundWalletList: string[],
  finalFundDistribution: number[],
  finalFundIndex: number,
}

/**
 *  V2
 */
export async function addRevenueTiersV2 (
  this: R3vlClient, 
  {
    walletList,
    distribution,
    tiers,
    finalFundWalletList,
    finalFundDistribution,
    finalFundIndex
  } : FnArgs
) {
  const { revPathV2Write, sdk } = this
  
  if (!revPathV2Write || !sdk) return

  // new added wallets slice(1) & final fund wallets
  const addedWalletList = [...walletList.slice(1), finalFundWalletList]

  // new added distribution slice(1) & final fund distribution
  const addedDistribution = [...distribution.slice(1), finalFundDistribution].map(item => {
    return item.map(el => Number(ethers.utils.parseUnits(el.toString(), 5).toString()))
  })

  // Transformations for limits update after adding tiers
  const tokens: string[] = tiers.map(tier => tier.token)
  const limits: number[][] =  tiers.map(tier => tier.limits)

  const sortedLimits = [...Array(limits[0].length).keys()].map(() => [])
  .map((arr: number[], arrIdx: number) => {
    return limits.map((limit, limitIdx) => {
      return arr[limitIdx] = limit[arrIdx]
    })
  })

  const limitArgs = sortedLimits.map((item, index) => {
    return {
      limits: item,
      index: finalFundIndex + index
    }
  })
  
  try {
    const addTx = await revPathV2Write.addRevenueTiers(
      addedWalletList,
      addedDistribution,
      {
        gasLimit: 900000,
      }
    )

    const addedResult = await addTx?.wait()

    let updateResult;

    if(addedResult.status === 1) {
      updateResult = await updateRevenueTiersV2.call(
        this,
        {
          walletList: [walletList[0]],
          distribution: [distribution[0]], 
          tierNumbers: [finalFundIndex],
        }
      )
    }

    let finalResult 
    
    if (updateResult) {

      const mapPromises = async(
        args: {limits: number[], index: number}[], 
        // fn: (this: R3vlClient, { tokens, newLimits, tier }: UpdateLimitsV2Args) => Promise<false | ContractReceipt | undefined>
        ) => {
        // const results = []
      
        for (const item of args) {
          // Fernando: commented out temporary for build purposes

          // results.push(await fn.call( 
          //   this,
          //   {
          //     tokens,
          //     newLimits: item.limits,
          //     tier: item.index, 
          //   }
          // ))
        }
      
        // return results
      }

      // finalResult = mapPromises(limitArgs, updateLimitsV2)

      console.log(finalResult, 'resolvePromisesSeq Success');
      
      return finalResult
    } else {
      console.error('addRevenueTier Fail')
    }
  } catch (error) {
    console.error(error, 'updateRevenueTiersV2 Error')
  }
}
