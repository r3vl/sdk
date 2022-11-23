import { PathLibraryV0__factory } from './typechain'

import { ERC20s } from "./constants/tokens"
import { communitySigner } from './utils'
import { ethers } from 'ethers'

/**
 *  V0
 */
export const withdrawFundsV0 = async (revPathAddress: string, walletAddress: string, isERC20?: keyof typeof ERC20s) => {
  const signer = communitySigner()
  const contract = PathLibraryV0__factory.connect(revPathAddress, signer)
  
  try {
    const tx = isERC20 ?
      await contract['release(address,address)'](ERC20s[isERC20], walletAddress) :
      await contract['release(address)'](walletAddress)
    const result = await tx?.wait()
    const [event] = result?.events || [{ args: [] }]

    console.log("Withdraw result:::...", event?.args && ethers.utils.formatEther(event?.args[1]))
  } catch (error) {
    console.error(error)
  }
}
