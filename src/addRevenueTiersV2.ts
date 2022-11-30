import { ethers } from 'ethers'
import { PathLibraryV2__factory } from './typechain'; 
import { updateLimitsV2 } from './updateLimitsV2';
import { updateRevenueTiersV2 } from './updateRevenueTiersV2';

/**
 *  V2
 */
export const addRevenueTiersV2 = async (
  signer: ethers.Signer,
  address: string,
  walletList: string[][],
  distribution: number[][], 
  tiers: { token: string, limits: number[] }[],
  finalFundWalletList: string[],
  finalFundDistribution: number[],
  finalFundIndex: number,
) => {
  const contract = PathLibraryV2__factory.connect(address, signer)

  // new added wallets slice(1) & final fund wallets
  const addedWalletList = [...walletList.slice(1), finalFundWalletList]

  // new added distribution slice(1) & final fund distribution
  const addedDistribution = [...distribution.slice(1), finalFundDistribution].map(item => {
    return item.map(el => Number(ethers.utils.parseUnits(el.toString(), 5).toString()))
  })

  // Transformations for limits update after adding tiers
  const tokens: string[] = tiers.map(tier => tier.token)
  const limits: number[][] =  tiers.map(tier => tier.limits)

  const sortedLimits = [...Array(limits[0].length).keys()].map(i => [])
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
    const addTx = await contract.addRevenueTiers(
      addedWalletList,
      addedDistribution,
      {
        gasLimit: 900000,
      }
    )

    const addedResult = await addTx?.wait()

    let updateResult;

    if(addedResult.status === 1) {
      updateResult = await updateRevenueTiersV2( 
        signer,
        address,
        [walletList[0]],
        [distribution[0]], 
        [finalFundIndex],
      )
    }

    let finalResult 
    
    if(updateResult?.status === 1) {

      const mapPromises = async(
        args: {limits: number[], index: number}[], 
        fn: (signer: ethers.Signer, address: string, tokens: string[], newLimits: number[], tier: number) => Promise<ethers.ContractReceipt | undefined>
        ) => {
        const results = []
      
        for (const item of args) {
          results.push(await fn( 
            signer,
            address,
            tokens,
            item.limits,
            item.index, 
          ))
        }
      
        return results
      }

      finalResult = mapPromises(limitArgs, updateLimitsV2)

      console.log(finalResult, 'resolvePromisesSeq Success');
      
      return finalResult
    } else {
      console.error('addRevenueTier Fail')
    }
  } catch (error) {
    console.error(error, 'updateRevenueTiersV2 Error')
  }
}

