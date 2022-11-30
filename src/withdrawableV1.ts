// import { ethers } from 'ethers'

// import { PathLibraryV1__factory } from './typechain'
// import { tokenList } from "./constants/tokens"
// import { ClientContext } from './types'

// /**
//  *  V1
//  */
// export const withdrawableV1 = () => {
//   const ctx = this as unknown as ClientContext

//   return async (revPathAddress: string, walletAddress: string, isERC20?: keyof typeof tokenList) => {
//     try {
//       const revPath = PathLibraryV1__factory.connect(revPathAddress, ctx.provider)
  
//       if (isERC20) {
//         const pendingBalance = await revPath.erc20Withdrawable(tokenList[isERC20][ctx._chainId], walletAddress)
  
//         return parseFloat(ethers.utils.formatEther(pendingBalance))
//       }
  
//       const pendingBalance = await revPath.getPendingEthBalance(walletAddress)
  
//       return parseFloat(ethers.utils.formatEther(pendingBalance))
//     } catch (error) {
//       console.error(error)
//     }
//   }
// }
