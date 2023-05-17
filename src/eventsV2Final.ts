import { MainnetSdk } from '@dethcrypto/eth-sdk-client';
import { R3vlClient } from './client';
import { contractsDeployedV2Final } from './constants/tokens';
import { RevenuePathCreatedEvent } from './typechain/ReveelMainV2Final';

/**
 * TODO(appleseed): build classes for RevenuePath & ReveelMain
 */

/**
 * all revenue paths V2
 */
export async function getRevenuePathsV2Final(this: R3vlClient) {
  const { sdk, _chainId } = this
  
  if (!sdk) throw new Error("SDK not initialized")

  const contract = sdk.reveelMainV2Final;
  const library = (sdk as typeof sdk & { pathLibraryV2Final: any }).pathLibraryV2Final;

  const pathsEventPayload: { [address: string]: RevenuePathCreatedEvent } = {}

  if (!library) throw new Error("Contract not found")

  const allPaths = await contract.queryFilter(
    contract.filters.RevenuePathCreated(),
    contractsDeployedV2Final[_chainId],
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
    contract: MainnetSdk["pathLibraryV2Final"]
    address: string
    eventPayload: RevenuePathCreatedEvent
  }[] = uniquePathAddresses.map((revPathAddress) => {
    const contract: MainnetSdk["pathLibraryV2Final"] = library.attach(revPathAddress)

    return {
      contract,
      address: revPathAddress,
      eventPayload: pathsEventPayload[revPathAddress]
    }
  })

  return revPaths;
}

export async function getRevPathTransactionEventsV2Final(this: R3vlClient, _revPathAddress: string) {
  const { revPathV2FinalRead, sdk, _chainId } = this

  if (!revPathV2FinalRead || !sdk || !_chainId) throw new Error("ERROR:")

  const ownershipTransferred = await revPathV2FinalRead.queryFilter(
    revPathV2FinalRead.filters.OwnershipTransferred(),
  )
  const paymentReleased = await revPathV2FinalRead.queryFilter(
    revPathV2FinalRead.filters.PaymentReleased(),
  )
  const eRC20PaymentReleased = await revPathV2FinalRead.queryFilter(revPathV2FinalRead.filters.ERC20PaymentReleased())
  const tokenDistributed = await revPathV2FinalRead.queryFilter(revPathV2FinalRead.filters.TokenDistributed())
  
  const blockNumber = ownershipTransferred?.[0]?.blockNumber

  const depositETHPromise = revPathV2FinalRead.queryFilter(revPathV2FinalRead.filters.DepositETH())
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
