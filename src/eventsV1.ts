import { getMainnetSdk, MainnetSdk } from '@dethcrypto/eth-sdk-client' // yay, our SDK! It's tailored especially for our needs
import { ethers } from 'ethers'
import { PathLibraryV1__factory } from './typechain';
import { EthDistributedEvent, PaymentReleasedEvent } from './typechain/PathLibraryV1';
import { communityProvider } from './utils';

/**
 * TODO(appleseed): build classes for RevenuePath & ReveelMain
 */

/**
 * all revenue paths V1
 */
export const getRevenuePathsV1 = async () => {
  const provider = communityProvider();
  const sdk = getMainnetSdk(provider);
  const contract = sdk.reveelMainV1;
  const library = sdk.pathLibraryV1;
  const allPaths = await contract.queryFilter(
    contract.filters.RevenuePathCreated(),
  )

  const uniquePathAddresses: string[] = []

  for (const path of allPaths) {
    const pathAddress = path.args.path
    if (!uniquePathAddresses.includes(pathAddress)) {
      uniquePathAddresses.push(pathAddress)
    }
  }

  const revPaths: {contract: MainnetSdk["pathLibraryV1"], address: string}[] = uniquePathAddresses.map((revPathAddress) => {
    const contract: MainnetSdk["pathLibraryV1"] = library.connect(revPathAddress)  
    return {
        contract,
        address: revPathAddress,
    }
  })

  return revPaths;
}

/**
 * withdraw events for V1
 */
export const getWithdrawEventsV1 = async () => {
  const revPaths = await getRevenuePathsV1();

  console.log("revPaths.length", revPaths.length);
  const withdrawEvents = (await Promise.all(revPaths.map(async (revPath) => {
    const withdraws: PaymentReleasedEvent[] = await getPaymentReleasedForPath(revPath.address);
    return withdraws
  }))).flat()

  return withdrawEvents
}

export const getWithdrawsForPath = async (address: string) => {
  const revPath = PathLibraryV1__factory.connect(address, communityProvider());
  const withdraws = await revPath.queryFilter(
    revPath.filters.EthDistributed(),
  )
  return withdraws;
};

export const getPaymentReleasedForPath = async (address: string) => {
  const revPath = PathLibraryV1__factory.connect(address, communityProvider());
  const withdraws = await revPath.queryFilter(
    revPath.filters.PaymentReleased(),
  )
  return withdraws;
};
