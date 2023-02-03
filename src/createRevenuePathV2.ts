import { BigNumberish, constants, ethers, utils } from 'ethers'
import { tokenList } from './constants/tokens';
import { R3vlClient } from './client'

export type FnArgs = {
  walletList: string[][],
  distribution: number[][], 
  tiers?: { [token: string]: BigNumberish }[],
  name: string,
  mutabilityEnabled: boolean
}

/**
 *  V2
 */
export async function createRevenuePathV2(
  this: R3vlClient, 
  { 
    walletList, 
    distribution, 
    tiers, 
    name, 
    mutabilityEnabled 
  } : FnArgs,
  {
    gasLimit
  }: {
    gasLimit: number
  } = {
    gasLimit: 900000
  }
) {
  const { sdk, _chainId } = this

  if (!sdk) return

  const contract = sdk.reveelMainV2;

  const formatedLimits: BigNumberish[][] = []
  const formatedTokens: string[] = []
  
  // tiers.forEach((item) => {
  //   switch (item.token) {
  //     case 'eth': {
  //       formatedLimits.push(item.limits.map(limit => utils.parseEther(limit.toString())))
  //       formatedTokens.push(constants.AddressZero)
  //       break
  //     }
  //     case 'weth': {
  //       formatedLimits.push(item.limits.map(limit => utils.parseUnits(limit.toString())))
  //       formatedTokens.push(tokenList.weth[_chainId])
  //       break
  //     }
  //     case 'usdc': {
  //       formatedLimits.push(item.limits.map(limit => utils.parseUnits(limit.toString())))
  //       formatedTokens.push(tokenList.usdc[_chainId])
  //       break
  //     }
  //     case 'dai': {
  //       formatedLimits.push(item.limits.map(limit => utils.parseUnits(limit.toString(), 18)))
  //       formatedTokens.push(tokenList.dai[_chainId])
  //       break
  //     }
  //   } 
  // })

  tiers?.map((tier, id) => {
    const tokens = Object.keys(tier)

    if (id === 0) {
      tokens.map((token) => {
        const tokenConfig = tokenList[token.toLowerCase() as keyof typeof tokenList]
  
        if (tokenConfig && tokenConfig[_chainId]) formatedTokens.push(tokenConfig[_chainId])
      })
    }

    formatedLimits.push(tokens.map((token) => tier[token]))
  })

  const formatedDistribution = distribution.map(item => {
     return item.map(el => {
      return Number(ethers.utils.parseUnits(el.toString(), 5).toString())
     })
  })

  try {
    const tx = await contract.createRevenuePath(
      walletList,
      formatedDistribution, 
      formatedTokens,
      formatedLimits,
      name,
      mutabilityEnabled,
      {
        gasLimit
      }
    )

    // const result = await tx?.wait()

    // console.log(result, 'createRevenuePathV2 Result');
    
    return tx
  } catch (error) {
    console.error(error, 'createRevenuePathV2 Error')

    throw error
  }
}
