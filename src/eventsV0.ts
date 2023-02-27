import { MainnetSdk } from '@dethcrypto/eth-sdk-client';
import { R3vlClient } from './client';
import { RevenuePathCreatedEvent } from './typechain/ReveelMainV0';

/**
 * TODO(appleseed): build classes for RevenuePath & ReveelMain
 */

/**
 * all revenue paths V0
 */
export async function getRevenuePathsV0(this: R3vlClient) {
  const { sdk } = this

  if (!sdk) return null

  const contract = (sdk as { reveelMainV0: any }).reveelMainV0;
  const library = (sdk as { pathLibraryV0: any }).pathLibraryV0;

  if (!library) return null

  const pathsEventPayload: { [address: string]: RevenuePathCreatedEvent } = {}

  const allPaths = await contract.queryFilter(
    contract.filters.RevenuePathCreated(),
  )

  const uniquePathAddresses: string[] = []

  for (const path of allPaths) {
    const pathAddress = path.args._walletAddress
    pathsEventPayload[pathAddress] = path

    if (!uniquePathAddresses.includes(pathAddress)) {
      uniquePathAddresses.push(pathAddress)
    }
  }

  const revPaths: {
    contract: MainnetSdk["pathLibraryV0"],
    address: string
    eventPayload: RevenuePathCreatedEvent
  }[] = uniquePathAddresses.map((revPathAddress) => {
    const contract: MainnetSdk["pathLibraryV0"] = library.attach(revPathAddress)

    return {
        contract,
        address: revPathAddress,
        eventPayload: pathsEventPayload[revPathAddress]
    }
  })

  return revPaths;
}

/**
 * withdraw events for V0
 */
// export const getWithdrawEventsV0 = async () => {
//   const revPaths = await getRevenuePathsV0();

//   console.log("revPaths.length", revPaths.length);
//   const withdrawEvents = (await Promise.all(revPaths.map(async (revPath) => {
//     const withdraws: PaymentReleasedEvent[] = await getPaymentReleasedForPath(revPath.address);
//     return withdraws
//   }))).flat()

//   return withdrawEvents
// }

// export const getWithdrawsForPath = async (address: string) => {
//   const revPath = PathLibraryV0__factory.connect(address, communityProvider());
//   const withdraws = await revPath.queryFilter(
//     revPath.filters.EthDistributed(),
//   )
//   return withdraws;
// };

// export const getPaymentReleasedForPath = async (address: string) => {
//   const revPath = PathLibraryV0__factory.connect(address, communityProvider());
//   const withdraws = await revPath.queryFilter(
//     revPath.filters.PaymentReleased(),
//   )
//   return withdraws;
// };

export async function getRevPathWithdrawEventsV0(this: R3vlClient) {
  const { revPathV0Read } = this

  if (!revPathV0Read) return

  const withdraws = await revPathV0Read.queryFilter(
    revPathV0Read.filters.PaymentReleased(),
  )

  return withdraws
}
