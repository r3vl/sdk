import { MainnetSdk } from '@dethcrypto/eth-sdk-client';
import { R3vlClient } from './client';
import { RevenuePathCreatedEvent } from './typechain/ReveelMainV2';

/**
 * TODO(appleseed): build classes for RevenuePath & ReveelMain
 */

/**
 * all revenue paths V1
 */
export async function getRevenuePathsV2(this: R3vlClient) {
  const { sdk } = this

  if (!sdk) throw new Error("ERROR:")
  
  const contract = sdk.reveelMainV2;
  const library = (sdk as { pathLibraryV2: any }).pathLibraryV2;
  const pathsEventPayload: { [address: string]: RevenuePathCreatedEvent } = {}

  if (!library) return null

  const allPaths = await contract.queryFilter(
    contract.filters.RevenuePathCreated(),
  )

  const uniquePathAddresses: string[] = []

  for (const path of allPaths) {
    const pathAddress = path.args.path
    pathsEventPayload[pathAddress] = path

    if (!uniquePathAddresses.includes(pathAddress)) {
      uniquePathAddresses.push(pathAddress)
    }
  }

  const revPaths: {contract: MainnetSdk["pathLibraryV2"], address: string}[] = uniquePathAddresses.map((revPathAddress) => {
    const contract: MainnetSdk["pathLibraryV2"] = library.connect(revPathAddress)

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
//   const revPaths = await getRevenuePathsV2();

//   console.log("revPaths.length", revPaths.length);
//   const withdrawEvents = (await Promise.all(revPaths.map(async (revPath) => {
//     const withdraws: PaymentReleasedEvent[] = await getPaymentReleasedForPath(revPath.address);
//     return withdraws
//   }))).flat()

//   return withdrawEvents
// }

// export const getWithdrawsForPath = async (address: string) => {
//   const revPath = PathLibraryV2__factory.connect(address, communityProvider());
//   const withdraws = await revPath.queryFilter(
//     revPath.filters.DepositETH(),
//   )
//   return withdraws;
// };

// export const getPaymentReleasedForPath = async (address: string) => {
//   const revPath = PathLibraryV2__factory.connect(address, communityProvider());
//   const withdraws = await revPath.queryFilter(
//     revPath.filters.PaymentReleased(),
//   )
//   return withdraws;
// };

export async function getRevPathWithdrawEventsV2(this: R3vlClient) {
  const { revPathV2Read } = this

  if (!revPathV2Read) return

  const withdraws = await revPathV2Read.queryFilter(
    revPathV2Read.filters.PaymentReleased(),
  )

  return withdraws
}
