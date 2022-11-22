import { getMainnetSdk, MainnetSdk } from '@dethcrypto/eth-sdk-client' // yay, our SDK! It's tailored especially for our needs
import { ethers } from 'ethers'
import { PathLibraryV0__factory } from './typechain';
import { PaymentReleasedEvent } from './typechain/PathLibraryV0';
import { communityProvider } from './utils';

/**
 * TODO(appleseed): build classes for RevenuePath & ReveelMain
 */

/**
 * all revenue paths V0
 */
export const getRevenuePathsV0 = async () => {
  const provider = communityProvider();
  console.log("community", provider);
  const sdk = getMainnetSdk(provider);
  const contract = sdk.reveelMainV0;
  const library = sdk.pathLibraryV0;
  const allPaths = await contract.queryFilter(
    contract.filters.RevenuePathCreated(),
  )

  const uniquePathAddresses: string[] = []

  for (const path of allPaths) {
    const pathAddress = path.args._walletAddress
    if (!uniquePathAddresses.includes(pathAddress)) {
      uniquePathAddresses.push(pathAddress)
    }
  }

  const revPaths: {contract: MainnetSdk["pathLibraryV0"], address: string}[] = uniquePathAddresses.map((revPathAddress) => {
    const contract: MainnetSdk["pathLibraryV0"] = library.connect(revPathAddress)  
    return {
        contract,
        address: revPathAddress,
    }
  })

  return revPaths;
}

/**
 * withdraw events for V0
 */
export const getWithdrawEventsV0 = async () => {
  const revPaths = await getRevenuePathsV0();

  console.log("revPaths.length", revPaths.length);
  const withdrawEvents = (await Promise.all(revPaths.map(async (revPath) => {
    const withdraws: PaymentReleasedEvent[] = await getPaymentReleasedForPath(revPath.address);
    return withdraws
  }))).flat()

  return withdrawEvents
}

// export const getWithdrawsForPath = async (address: string) => {
//   const revPath = PathLibraryV0__factory.connect(address, communityProvider());
//   const withdraws = await revPath.queryFilter(
//     revPath.filters.EthDistributed(),
//   )
//   return withdraws;
// };

export const getPaymentReleasedForPath = async (address: string) => {
  const revPath = PathLibraryV0__factory.connect(address, communityProvider());
  const withdraws = await revPath.queryFilter(
    revPath.filters.PaymentReleased(),
  )
  return withdraws;
};
