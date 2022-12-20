import { Provider } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'

import {
  InvalidConfigError,
  MissingProviderError,
  MissingSignerError
} from '../errors'

import type { ClientConfig } from '../types'
import { ChainIds } from '../constants/tokens'
import { PathLibraryV0__factory, PathLibraryV1__factory, PathLibraryV2__factory } from '../typechain'
import { getMainnetSdk, getGoerliSdk } from '@dethcrypto/eth-sdk-client'

export default class Base {
  protected readonly _chainId: ChainIds
  protected readonly _ensProvider: Provider | undefined
  // TODO: something better we can do here to handle typescript check for missing signer?
  protected readonly _signer: Signer
  private readonly _provider: Provider
  protected readonly _includeEnsNames: boolean
  protected readonly _revPathAddress: string

  constructor({
    chainId,
    provider,
    ensProvider,
    signer,
    includeEnsNames = false,
    revPathAddress
  }: ClientConfig) {
    if (includeEnsNames && !provider && !ensProvider)
      throw new InvalidConfigError(
        'Must include a mainnet provider if includeEnsNames is set to true',
      )
    if (!signer) throw new MissingSignerError('Signer is required.')
    if (!revPathAddress) throw new InvalidConfigError("Could not initialize Revenue Path")

    this._ensProvider = ensProvider ?? provider
    this._provider = provider
    this._chainId = chainId
    this._signer = signer
    this._includeEnsNames = includeEnsNames
    this._revPathAddress = revPathAddress
  }

  protected _initV0RevPath({ signer }: { signer?: boolean } = {}) {
    const revPathV0 = PathLibraryV0__factory.connect(
      this._revPathAddress,
      signer ? this._signer : this._provider
    )
    const sdk =  this._chainId === 5 ? getGoerliSdk(this._provider) : getMainnetSdk(this._provider)

    return {
      revPathV0,
      sdk
    }
  }

  protected _initV1RevPath({ signer }: { signer?: boolean } = {}) {
    const revPathV1 = PathLibraryV1__factory.connect(
      this._revPathAddress,
      signer ? this._signer : this._provider
    )
    const sdk =  this._chainId === 5 ? getGoerliSdk(this._provider) : getMainnetSdk(this._provider)

    return {
      revPathV1,
      sdk
    }
  }

  protected _initV2RevPath({ signer }: { signer?: boolean } = {}) {
    const revPathV2 = PathLibraryV2__factory.connect(
      this._revPathAddress,
      signer ? this._signer : this._provider
    )
    const sdk =  this._chainId === 5 ? getGoerliSdk(this._provider) : getMainnetSdk(this._provider)

    return {
      revPathV2,
      sdk
    }
  }

  protected _requireProvider() {
    if (!this._provider)
      throw new MissingProviderError(
        'Provider required to perform this action, please update your call to the constructor',
      )
  }
}
