import { ethers } from 'ethers'

import { PathLibraryV0__factory } from './typechain'
import { tokenList } from "./constants/tokens"
import { communityProvider } from './utils'
import { getMainnetSdk, getGoerliSdk } from '@dethcrypto/eth-sdk-client'


/**
 *  V0
 */
export const withdrawnV0 = async (revPathAddress: string, walletAddress: string, isERC20?: 'weth') => {
  const provider = communityProvider()
  const { chainId } = await provider.getNetwork()

  try {
    const revPath = PathLibraryV0__factory.connect(revPathAddress, provider)


  
    return
  } catch (error) {
    console.error(error)
  }
}
