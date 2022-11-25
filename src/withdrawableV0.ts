import { ethers } from 'ethers'

import { PathLibraryV0__factory } from './typechain'
import { tokenList } from "./constants/tokens"
import { communityProvider } from './utils'
import { getMainnetSdk, getGoerliSdk } from '@dethcrypto/eth-sdk-client'


/**
 *  V0
 */
export const withdrawableV0 = async (revPathAddress: string, walletAddress: string, isERC20?: 'weth') => {
  const provider = communityProvider()
  const { chainId } = await provider.getNetwork()

  try {
    const revPath = PathLibraryV0__factory.connect(revPathAddress, provider)

    const walletShare = await revPath.shares(walletAddress)
    
    if (isERC20) {
      const sdk = getGoerliSdk(provider)

      const released = await revPath['released(address,address)'](tokenList[isERC20][chainId], walletAddress)
      const totalReceived = await sdk[isERC20].balanceOf(revPathAddress)
      const totalAccounted = parseFloat(ethers.utils.formatEther(totalReceived)) + parseFloat(ethers.utils.formatEther(released))

      return (totalAccounted * walletShare.toNumber() / 10000) - parseFloat(ethers.utils.formatEther(released))
    }

    const released = await revPath['released(address)'](walletAddress)
    const deposits = await revPath.queryFilter(
      revPath.filters.PaymentReceived()
    )
    const totalReceived = deposits
      .filter(ev => {
        const [wallet] = ev?.args || [""]

        return wallet === walletAddress
      })
      .reduce((prev, curr: { args: any[] }) => prev + parseFloat(ethers.utils.formatEther(curr?.args[1])), 0)

    return (totalReceived * walletShare.toNumber() / 10000) - parseFloat(ethers.utils.formatEther(released))
  } catch (error) {
    console.error(error)
  }
}
