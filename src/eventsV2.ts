import { getMainnetSdk, MainnetSdk } from '@dethcrypto/eth-sdk-client' // yay, our SDK! It's tailored especially for our needs
import { ethers } from 'ethers'
import { R3vlClient } from './client';
import { PathLibraryV2__factory } from './typechain';
import { DepositETHEvent, PaymentReleasedEvent } from './typechain/PathLibraryV2';
import { communityProvider } from './utils';

/**
 * TODO(appleseed): build classes for RevenuePath & ReveelMain
 */

/**
 * all revenue paths V1
 */
export const getRevenuePathsV2 = async () => {
  const provider = communityProvider();
  const sdk = getMainnetSdk(provider);
  const contract = sdk.reveelMainV2;
  const library = sdk.pathLibraryV2;
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

  const revPaths: {contract: MainnetSdk["pathLibraryV2"], address: string}[] = uniquePathAddresses.map((revPathAddress) => {
    const contract: MainnetSdk["pathLibraryV2"] = library.connect(revPathAddress)  
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
  const revPaths = await getRevenuePathsV2();

  console.log("revPaths.length", revPaths.length);
  const withdrawEvents = (await Promise.all(revPaths.map(async (revPath) => {
    const withdraws: PaymentReleasedEvent[] = await getPaymentReleasedForPath(revPath.address);
    return withdraws
  }))).flat()

  return withdrawEvents
}

export const getWithdrawsForPath = async (address: string) => {
  const revPath = PathLibraryV2__factory.connect(address, communityProvider());
  const withdraws = await revPath.queryFilter(
    revPath.filters.DepositETH(),
  )
  return withdraws;
};

export const getPaymentReleasedForPath = async (address: string) => {
  const revPath = PathLibraryV2__factory.connect(address, communityProvider());
  const withdraws = await revPath.queryFilter(
    revPath.filters.PaymentReleased(),
  )
  return withdraws;
};

export async function getRevPathWithdrawEventsV2(this: R3vlClient) {
  const { revPathV2 } = this

  if (!revPathV2) return

  const withdraws = await revPathV2.queryFilter(
    revPathV2.filters.PaymentReleased(),
  )
  return withdraws
}
