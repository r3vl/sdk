import { PathLibraryV0__factory } from './typechain'

import { ERC20s } from "./constants/tokens"
import { ethers } from 'ethers'

/**
 *  V0
 */
export const withdrawFundsV0 = async (revPathAddress: string, walletAddress: string, isERC20?: keyof typeof ERC20s) => {
  const goerliProvider = ethers.getDefaultProvider('goerli')
  const signer = new ethers.Wallet('', goerliProvider) // TODO: get signer from global shared config?
  const contract = PathLibraryV0__factory.connect(revPathAddress, signer)

  let tx

  try {
    if (isERC20) {
      const withdraw = contract.functions['release(address,address)']
      
      tx = await withdraw(ERC20s[isERC20], walletAddress)
    } else {
      const withdraw = contract.functions['release(address)']
      
      tx = await withdraw(walletAddress)
    }
  } catch (error) {
    console.error(error)
  }

  const result = await tx?.wait()

  console.log("Withdraw result:::...", result)
}
