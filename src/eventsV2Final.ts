import { MainnetSdk } from '@dethcrypto/eth-sdk-client';
import { R3vlClient } from './client';
import { contractsDeployedV2 } from './constants/tokens';
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
