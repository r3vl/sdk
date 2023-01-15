import { Provider } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'

import {
  InvalidConfigError,
  MissingProviderError,
  MissingSignerError
} from '../errors'

import type { ClientConfig } from '../types'
import { chainIds, ChainIds } from '../constants/tokens'
import { PathLibraryV0__factory, PathLibraryV1__factory, PathLibraryV2__factory } from '../typechain'
import { getMainnetSdk, getGoerliSdk } from '@dethcrypto/eth-sdk-client'

const sdks = {
  [chainIds.goerli]: getGoerliSdk,
  [chainIds.mainnet]: getMainnetSdk,
}

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

    this._ensProvider = ensProvider ?? provider
    this._provider = provider
    this._chainId = chainId
    this._signer = signer
    this._includeEnsNames = includeEnsNames
    this._revPathAddress = revPathAddress || ''
  }

  protected _initV0RevPath() {
    const revPathV0Read = PathLibraryV0__factory.connect(
      this._revPathAddress,
      this._provider
    )
    const revPathV0Write = PathLibraryV0__factory.connect(
      this._revPathAddress,
      this._signer
    )
    const sdk =  sdks[this._chainId](this._signer)

    return {
      revPathV0Read,
      revPathV0Write,
      sdk
    }
  }

  protected _initV1RevPath() {
    const revPathV1Read = PathLibraryV1__factory.connect(
      this._revPathAddress,
      this._provider
    )
    const revPathV1Write = PathLibraryV1__factory.connect(
      this._revPathAddress,
      this._signer
    )
    const sdk =  sdks[this._chainId](this._signer)

    return {
      revPathV1Read,
      revPathV1Write,
      sdk
    }
  }

  protected _initV2RevPath() {
    const sdk =  sdks[this._chainId](this._signer)

    if (this._revPathAddress === '') return {
      byPass: true,
      sdk
    }

    const revPathV2Read = PathLibraryV2__factory.connect(
      this._revPathAddress,
      this._provider
    )
    const revPathV2Write = PathLibraryV2__factory.connect(
      this._revPathAddress,
      this._provider
    )

    return {
      revPathV2Read,
      revPathV2Write,
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
