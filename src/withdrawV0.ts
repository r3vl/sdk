import { PathLibraryV0__factory } from './typechain'

import { tokenList } from "./constants/tokens"
import { communityProvider } from './utils'
import { ethers } from 'ethers'

/**
 *  V0
 */
export const withdrawFundsV0 = async (signer: ethers.Signer, revPathAddress: string, walletAddress: string, isERC20?: keyof typeof tokenList) => {
  const contract = PathLibraryV0__factory.connect(revPathAddress, signer)
  const provider = communityProvider()
  const { chainId } = await provider.getNetwork()
  
  try {
    const tx = isERC20 ?
      await contract['release(address,address)'](tokenList[isERC20][chainId], walletAddress) :
      await contract['release(address)'](walletAddress)
    const result = await tx?.wait()
    const [event] = result?.events || [{ args: [] }]

    return event?.args && ethers.utils.formatEther(event?.args[1])
  } catch (error) {
    console.error(error)
  }
}
