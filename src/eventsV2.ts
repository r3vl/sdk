import { MainnetSdk } from '@dethcrypto/eth-sdk-client';
import { R3vlClient } from './client';
import { contractsDeployedV2 } from './constants/tokens';
import { PaymentReleasedEvent } from './typechain/PathLibraryV2';
import { RevenuePathCreatedEvent } from './typechain/ReveelMainV2';

/**
 * TODO(appleseed): build classes for RevenuePath & ReveelMain
 */

/**
 * all revenue paths V1
 */
export async function getRevenuePathsV2(this: R3vlClient) {
  const { sdk, _chainId } = this
  
  if (!sdk) throw new Error("SDK not initialized")

  const contract = sdk.reveelMainV2;
  const library = (sdk as { pathLibraryV2: any }).pathLibraryV2;

  const pathsEventPayload: { [address: string]: RevenuePathCreatedEvent } = {}

  if (!library) throw new Error("Contract not found")

  const allPaths = await contract.queryFilter(
    contract.filters.RevenuePathCreated(),
    contractsDeployedV2[_chainId],
    'latest'
  )

  const uniquePathAddresses: string[] = []

  for (const path of allPaths) {
    const pathAddress = path.args.path
    pathsEventPayload[pathAddress] = path

    if (!uniquePathAddresses.includes(pathAddress)) {
      uniquePathAddresses.push(pathAddress)
    }
  }

  const revPaths: {
    contract: MainnetSdk["pathLibraryV2"]
    address: string
    eventPayload: RevenuePathCreatedEvent
  }[] = uniquePathAddresses.map((revPathAddress) => {
    const contract: MainnetSdk["pathLibraryV2"] = library.attach(revPathAddress)

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

export async function getRevPathTransactionEventsV2(this: R3vlClient) {
  const { revPathV2Read, sdk, _revPathAddress, _chainId } = this

  if (!revPathV2Read || !sdk || !_chainId) throw new Error("ERROR:")

  const ownershipTransferred = await revPathV2Read.queryFilter(
    revPathV2Read.filters.OwnershipTransferred(),
  )
  const paymentReleased = await revPathV2Read.queryFilter(
    revPathV2Read.filters.PaymentReleased(),
  )
  const eRC20PaymentReleased = await revPathV2Read.queryFilter(revPathV2Read.filters.ERC20PaymentReleased())
  const tokenDistributed = await revPathV2Read.queryFilter(revPathV2Read.filters.TokenDistributed())
  
  const blockNumber = contractsDeployedV2[_chainId]

  const depositETH = await revPathV2Read.queryFilter(revPathV2Read.filters.DepositETH())
  const wethTransfers = await sdk?.weth.queryFilter(sdk?.weth.filters.Transfer(undefined, _revPathAddress), blockNumber, 'latest')
  const usdcTransers = await sdk?.usdc.queryFilter(sdk?.usdc.filters.Transfer(undefined, _revPathAddress), blockNumber, 'latest')
  const daiTransfers = await sdk?.dai.queryFilter(sdk?.dai.filters.Transfer(undefined, _revPathAddress), blockNumber, 'latest')

  return {
    ownershipTransferred,
    paymentReleased,
    eRC20PaymentReleased,
    tokenDistributed,
    depositETH,
    wethTransfers,
    usdcTransers,
    daiTransfers
  }
}
