import { PathLibraryV1__factory } from './typechain'

import { tokenList } from "./constants/tokens"
import { communityProvider } from './utils'
import { ethers } from 'ethers'

/**
 *  V1
 */
export const withdrawFundsV1 = async (signer: ethers.Signer, revPathAddress: string, walletAddress: string, isERC20?: keyof typeof tokenList) => {
  const contract = PathLibraryV1__factory.connect(revPathAddress, signer)
  const provider = communityProvider()
  const { chainId } = await provider.getNetwork()
  
  try {
    const tx = isERC20 ?
      await contract.releaseERC20(tokenList[isERC20][chainId], walletAddress) :
      await contract.release(walletAddress)
    const result = await tx?.wait()
    const [event] = result?.events || [{ args: [] }]
    
    console.log("Withdraw result:::...", event?.args && ethers.utils.formatEther(event?.args[1]))
  } catch (error) {
    console.error(error)
  }
}
