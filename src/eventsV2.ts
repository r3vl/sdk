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
export async function getRevenuePathsV2(this: R3vlClient, opts?: {
  startBlock?: number
}) {
  const { sdk, _chainId } = this
  
  if (!sdk) throw new Error("SDK not initialized")

  const contract = sdk.reveelMainV2;
  const library = (sdk as typeof sdk & { pathLibraryV2: any }).pathLibraryV2;

  const pathsEventPayload: { [address: string]: RevenuePathCreatedEvent } = {}

  if (!library) throw new Error("Contract not found")

  const allPaths = await contract.queryFilter(
    contract.filters.RevenuePathCreated(),
    opts?.startBlock || contractsDeployedV2[_chainId],
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

export async function getRevPathTransactionEventsV2(this: R3vlClient, _revPathAddress: string) {
  const { revPathV2Read, sdk, _chainId } = this

  if (!revPathV2Read || !sdk || !_chainId) throw new Error("ERROR:")

  const ownershipTransferred = await revPathV2Read.queryFilter(
    revPathV2Read.filters.OwnershipTransferred(),
  )
  const paymentReleased = await revPathV2Read.queryFilter(
    revPathV2Read.filters.PaymentReleased(),
  )
  const eRC20PaymentReleased = await revPathV2Read.queryFilter(revPathV2Read.filters.ERC20PaymentReleased())
  const tokenDistributed = await revPathV2Read.queryFilter(revPathV2Read.filters.TokenDistributed())
  
  const blockNumber = ownershipTransferred?.[0]?.blockNumber

  const depositETHPromise = revPathV2Read.queryFilter(revPathV2Read.filters.DepositETH())
  const wethTransfersPromise = sdk?.weth.queryFilter(sdk?.weth.filters.Transfer(undefined, _revPathAddress), blockNumber, 'latest')
  const usdcTransfersPromise = sdk?.usdc.queryFilter(sdk?.usdc.filters.Transfer(undefined, _revPathAddress), blockNumber, 'latest')
  const daiTransfersPromise = sdk?.dai.queryFilter(sdk?.dai.filters.Transfer(undefined, _revPathAddress), blockNumber, 'latest')

  const [
    depositETH,
    wethTransfers,
    usdcTransfers,
    daiTransfers
  ] = await Promise.all([depositETHPromise, wethTransfersPromise, usdcTransfersPromise, daiTransfersPromise])

  return {
    ownershipTransferred,
    paymentReleased,
    eRC20PaymentReleased,
    tokenDistributed,
    depositETH,
    wethTransfers,
    usdcTransfers,
    daiTransfers,
    erc20s: {
      [sdk?.weth.address]: await sdk?.weth.symbol(),
      [sdk?.usdc.address]: await sdk?.usdc.symbol(),
      [sdk?.dai.address]: await sdk?.dai.symbol()
    }
  }
}
