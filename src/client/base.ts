import { Provider } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'

import {
  InvalidConfigError,
  MissingProviderError,
  MissingSignerError
} from '../errors'

import { MISSING_SIGNER } from '../types'

import type { MISSING_SIGNER as MISSING_SIGNER_TYPE, SplitsClientConfig } from '../types'
import { ChainIds } from '../constants/tokens'
import { PathLibraryV0__factory, PathLibraryV1__factory } from '../typechain'
import { getMainnetSdk, getGoerliSdk } from '@dethcrypto/eth-sdk-client'

export default class Base {
  protected readonly _chainId: ChainIds
  protected readonly _ensProvider: Provider | undefined
  // TODO: something better we can do here to handle typescript check for missing signer?
  protected readonly _signer: Signer | typeof MISSING_SIGNER_TYPE
  private readonly _provider: Provider
  protected readonly _includeEnsNames: boolean
  protected readonly _revPathAddress: string | undefined


  constructor({
    chainId,
    provider,
    ensProvider,
    signer,
    includeEnsNames = false,
    revPathAddress
  }: SplitsClientConfig) {
    if (includeEnsNames && !provider && !ensProvider)
      throw new InvalidConfigError(
        'Must include a mainnet provider if includeEnsNames is set to true',
      )

    this._ensProvider = ensProvider ?? provider
    this._provider = provider
    this._chainId = chainId
    this._signer = signer ?? MISSING_SIGNER
    this._includeEnsNames = includeEnsNames
    this._revPathAddress = revPathAddress
  }

  protected _initV0RevPath() {
    const revPathV0 = this._revPathAddress ? PathLibraryV0__factory.connect(this._revPathAddress, this._provider) : undefined
    const sdk = getMainnetSdk(this._provider)

    return {
      revPathV0,
      sdk
    }
  }

  protected _initV1RevPath() {
    const revPathV1 = this._revPathAddress ? PathLibraryV1__factory.connect(this._revPathAddress, this._provider) : undefined
    const sdk = getMainnetSdk(this._provider)

    return {
      revPathV1,
      sdk
    }
  }

  protected _requireProvider() {
    if (!this._provider)
      throw new MissingProviderError(
        'Provider required to perform this action, please update your call to the constructor',
      )
  }

  protected _requireSigner() {
    this._requireProvider()
    if (!this._signer) {
      throw new MissingSignerError(
        'Signer required to perform this action, please update your call to the constructor',
      )
    }

    const sdk = getMainnetSdk(this._signer)

    return {
      sdk
    }
  }
}
