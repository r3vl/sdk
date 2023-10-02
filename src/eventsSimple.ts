import { MainnetSdk, GoerliSdk } from '@dethcrypto/eth-sdk-client';
import { R3vlClient } from './client';
import { contractsDeployedSimple } from './constants/tokens';
import { RevenuePathCreatedEvent } from './typechain/ReveelMainSimple';

/**
 * TODO(appleseed): build classes for RevenuePath & ReveelMain
 */

/**
 * all revenue paths Simple
 */
export async function getRevenuePathsSimple(this: R3vlClient, opts?: {
  startBlock?: number
}) {
  const { sdk, _chainId } = this

  const contract = (sdk as any).reveelMainSimple
  
  if (!sdk || !contract) throw new Error("SDK not initialized")

  const library = (sdk as typeof sdk & { pathLibrarySimple: any }).pathLibrarySimple;

  const pathsEventPayload: { [address: string]: RevenuePathCreatedEvent.Event } = {}

  if (!library) throw new Error("Contract not found")

  const allPaths = await contract.queryFilter(
    contract.filters.RevenuePathCreated(),
    opts?.startBlock || contractsDeployedSimple[_chainId],
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
    contract: GoerliSdk["pathLibrarySimple"]
    address: string
    eventPayload: RevenuePathCreatedEvent.Event
  }[] = uniquePathAddresses.map((revPathAddress) => {
    const contract: GoerliSdk["pathLibrarySimple"] = library.attach(revPathAddress)

    return {
      contract,
      address: revPathAddress,
      eventPayload: pathsEventPayload[revPathAddress]
    }
  })

  return revPaths;
}

export async function getRevPathTransactionEventsSimple(this: R3vlClient, _revPathAddress: string) {
  const { revPathSimpleRead, sdk, _chainId } = this

  if (!revPathSimpleRead || !sdk || !_chainId) throw new Error("ERROR:")

  const ownershipTransferred = await revPathSimpleRead.queryFilter(
    revPathSimpleRead.filters.OwnershipTransferred(),
  )
  const paymentReleased = await revPathSimpleRead.queryFilter(
    revPathSimpleRead.filters.PaymentReleased(),
  )
  const eRC20PaymentReleased = await revPathSimpleRead.queryFilter(revPathSimpleRead.filters.ERC20PaymentReleased())
  const tokenDistributed = await revPathSimpleRead.queryFilter(revPathSimpleRead.filters.TokenDistributed())

  // const blockNumber = ownershipTransferred?.[0]?.blockNumber

  const depositETHPromise = revPathSimpleRead.queryFilter(revPathSimpleRead.filters.DepositETH())
  const depositETH = await depositETHPromise
  // const wethTransfersPromise = sdk?.weth.queryFilter(sdk?.weth.filters.Transfer(undefined, _revPathAddress))
  // const usdcTransfersPromise = sdk?.usdc.queryFilter(sdk?.usdc.filters.Transfer(undefined, _revPathAddress))
  // const daiTransfersPromise = sdk?.dai.queryFilter(sdk?.dai.filters.Transfer(undefined, _revPathAddress))

  // const [
  //   depositETH,
  //   wethTransfers,
  //   usdcTransfers,
  //   daiTransfers
  // ] = await Promise.all([depositETHPromise, wethTransfersPromise, usdcTransfersPromise, daiTransfersPromise])

  return {
    ownershipTransferred,
    paymentReleased,
    eRC20PaymentReleased,
    tokenDistributed,
    depositETH,
    wethTransfers: [],
    usdcTransfers: [],
    daiTransfers: [],
    erc20s: {
      [sdk?.weth.target as string]: await sdk?.weth.symbol(),
      [sdk?.usdc.target as string]: await sdk?.usdc.symbol(),
      [sdk?.dai.target as string]: await sdk?.dai.symbol()
    }
  }
}
