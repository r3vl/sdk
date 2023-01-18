import "@testing-library/jest-dom/extend-expect"

import { MainnetSdk } from '@dethcrypto/eth-sdk-client'
import type { Provider } from '@ethersproject/abstract-provider'
import type { Signer } from '@ethersproject/abstract-signer'

import { ChainIds } from './constants/tokens'
import { PathLibraryV0 } from './typechain'

export type ClientConfig = {
  chainId: ChainIds
  provider: Provider
  revPathAddress?: string
  signer?: Signer
  includeEnsNames?: boolean
  // ensProvider can be used to fetch ens names when provider is not on mainnet (reverseRecords
  // only works on mainnet).
  ensProvider?: Provider
}

export const MISSING_SIGNER = ''

export type ClientContext = {
  _chainId: ChainIds
  _ensProvider: Provider
  _signer: Signer | typeof MISSING_SIGNER
  _provider: Provider
  _includeEnsNames: boolean
  revPathV0: PathLibraryV0
  sdk: MainnetSdk
  _revPathAddress: string
}
