import { MainnetSdk } from '@dethcrypto/eth-sdk-client';
import { R3vlClient } from './client';
import { RevenuePathCreatedEvent } from './typechain/ReveelMainV1';

/**
 * TODO(appleseed): build classes for RevenuePath & ReveelMain
 */

/**
 * all revenue paths V1
 */
export async function getRevenuePathsV1(this: R3vlClient, opts?: {
  startBlock?: number
}) {
  const { sdk } = this

  if (!sdk) return null
  
  const contract = sdk.reveelMainV1;
  const library = (sdk as typeof sdk & { pathLibraryV1: any }).pathLibraryV1;

  if (!library) return null

  const pathsEventPayload: { [address: string]: RevenuePathCreatedEvent } = {}

  const allPaths = await contract.queryFilter(
    contract.filters.RevenuePathCreated(),
    opts?.startBlock || undefined,
    "latest"
  )

  const uniquePathAddresses: string[] = []

  for (const path of allPaths) {
    const pathAddress = path.args.path
    pathsEventPayload[pathAddress] = path

    if (!uniquePathAddresses.includes(pathAddress)) {
      uniquePathAddresses.push(pathAddress)
    }
  }

  const revPaths: {contract: MainnetSdk["pathLibraryV1"], address: string}[] = uniquePathAddresses.map((revPathAddress) => {
    const contract: MainnetSdk["pathLibraryV1"] = library.attach(revPathAddress)

    return {
        contract,
        address: revPathAddress,
        eventPayload: pathsEventPayload[revPathAddress]
    }
  })

  return revPaths;
}

/**
 * withdraw events for V1
 */
// export const getWithdrawEventsV1 = async () => {
//   const revPaths = await getRevenuePathsV1();

//   console.log("revPaths.length", revPaths.length);
//   const withdrawEvents = (await Promise.all(revPaths.map(async (revPath) => {
//     const withdraws: PaymentReleasedEvent[] = await getPaymentReleasedForPath(revPath.address);
//     return withdraws
//   }))).flat()

//   return withdrawEvents
// }

// export const getWithdrawsForPath = async (address: string) => {
//   const revPath = PathLibraryV1__factory.connect(address, communityProvider());
//   const withdraws = await revPath.queryFilter(
//     revPath.filters.EthDistributed(),
//   )
//   return withdraws;
// };

// export const getPaymentReleasedForPath = async (address: string) => {
//   const revPath = PathLibraryV1__factory.connect(address, communityProvider());
//   const withdraws = await revPath.queryFilter(
//     revPath.filters.PaymentReleased(),
//   )
//   return withdraws;
// };

export async function getRevPathWithdrawEventsV1(this: R3vlClient) {
  const { revPathV1Read } = this

  if (!revPathV1Read) return

  const withdraws = await revPathV1Read.queryFilter(
    revPathV1Read.filters.PaymentReleased(),
  )

  return withdraws
}
