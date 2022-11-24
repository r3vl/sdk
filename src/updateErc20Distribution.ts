import { ethers } from 'ethers'
import { PathLibraryV1__factory } from './typechain'


export const updateErc20Distribution = async (
  signer: ethers.Signer,
  revPathAddress: string,
  walletList: string[],
  distribution: number[], 
) => {
  const contract = PathLibraryV1__factory.connect(revPathAddress, signer)

  const formatedDistribution = distribution.map(item => Number(ethers.utils.parseUnits(item.toString(), 5).toString()))

  try {
    const tx = await contract.updateErc20Distribution(
      walletList,
      formatedDistribution, 
      {
        gasLimit: 900000,
      }
    )

    const result = await tx?.wait()

    console.log(result, 'updateErc20Distribution actualResult');

    return result

  } catch (error) {
    console.error(error, 'updateErc20Distribution Error')
  }
}