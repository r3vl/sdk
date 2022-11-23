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
    let tx

    if (isERC20) {
      const withdraw = contract.functions['release(address,address)']
      
      tx = await withdraw(ERC20s[isERC20], walletAddress)
    } else {
      const withdraw = contract.functions['release(address)']

      tx = await withdraw(walletAddress)
    }

    const result = await tx?.wait()
    console.log("AAAA:::.", result)
    const [event] = result?.events || [{ args: [] }]

    console.log("Withdraw result:::...", event?.args && ethers.utils.formatEther(event?.args[1]))
  } catch (error) {
    console.error(error)
  }
}
