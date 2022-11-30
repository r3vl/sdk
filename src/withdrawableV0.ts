import { ethers } from 'ethers'
import { R3vlClient } from './client'

import { tokenList } from "./constants/tokens"

export type FnArgs = {
  walletAddress: string
  isERC20?: keyof typeof tokenList
}

/**
 *  V0
 */
export async function withdrawableV0(this: R3vlClient, { walletAddress, isERC20 }: FnArgs) {
  const { revPathV0, sdk, _chainId, _revPathAddress } = this // TODO: Find a better way to declare shape of class context

  if (!revPathV0 || !sdk) return false

  try {
    const walletShare = await revPathV0.shares(walletAddress)

    if (isERC20) {
      const tokenAddress = tokenList[isERC20][_chainId]
      let tokenSdk

      switch (isERC20) {
        case 'weth':
            tokenSdk = sdk.weth
          break
        case 'usdc':
            tokenSdk = sdk.usdc
          break
        case 'dai':
            tokenSdk = sdk.dai
          break
        default:
            tokenSdk = sdk.weth
          break
      }

      const released = await revPathV0['released(address,address)'](tokenAddress, walletAddress)
      const totalReceived = await tokenSdk.balanceOf(_revPathAddress)
      const totalAccounted = parseFloat(ethers.utils.formatEther(totalReceived)) + parseFloat(ethers.utils.formatEther(released))

      return (totalAccounted * walletShare.toNumber() / 10000) - parseFloat(ethers.utils.formatEther(released))
    }

    const released = await revPathV0['released(address)'](walletAddress)
    const deposits = await revPathV0.queryFilter(
      revPathV0.filters.PaymentReceived()
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
