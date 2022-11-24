import { ethers } from 'ethers'

import { PathLibraryV0__factory } from './typechain'
import { tokenList } from "./constants/tokens"
import { communityProvider } from './utils'


/**
 *  V0
 */
export const withdrawableV0 = async (revPathAddress: string, walletAddress: string, isERC20?: keyof typeof tokenList) => {
  const provider = communityProvider()

  try {
    const revPath = PathLibraryV0__factory.connect(revPathAddress, provider)
    const withdraws = await revPath.queryFilter(
      revPath.filters.PaymentReleased()
    )
    const paymentsReceived = withdraws
      .filter(ev => {
        const [wallet] = ev?.args || [""]

        return wallet === walletAddress
      })
      .reduce((prev, curr: { args: any[] }) => prev + parseFloat(ethers.utils.formatEther(curr?.args[1])), 0)

    const deposits = await revPath.queryFilter(
      revPath.filters.PaymentReceived()
    )
    const depositsReceived = deposits
      .filter(ev => {
        const [wallet] = ev?.args || [""]

        return wallet === walletAddress
      })
      .reduce((prev, curr: { args: any[] }) => prev + parseFloat(ethers.utils.formatEther(curr?.args[1])), 0)

    return depositsReceived - paymentsReceived
  } catch (error) {
    console.error(error)
  }
}
