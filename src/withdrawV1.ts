import { PathLibraryV1__factory } from './typechain'

import { ERC20s } from "./constants/tokens"
import { communitySigner } from './utils'

/**
 *  V1
 */
export const withdrawFundsV1 = async (revPathAddress: string, walletAddress: string, isERC20?: keyof typeof ERC20s) => {
  const signer = communitySigner()
  const contract = PathLibraryV1__factory.connect(revPathAddress, signer)

  let tx

  try {
    if (isERC20) {
      const withdraw = contract.functions.releaseERC20

      tx = await withdraw(ERC20s[isERC20], walletAddress)
    } else {
      const withdraw = contract.functions.release

      tx = await withdraw(walletAddress)
    }
  } catch (error) {
    console.error(error)
  }

  const result = await tx?.wait()

  console.log("Withdraw result:::...", result)
}
