import { Provider } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { GelatoRelay, CallWithERC2771Request } from "@gelatonetwork/relay-sdk"

import {
  InvalidConfigError,
  MissingProviderError,
  MissingSignerError
} from '../errors'

import type { ClientConfig } from '../types'
import { chainIds, ChainIds } from '../constants/tokens'
import { PathLibraryV0__factory, PathLibraryV1__factory, PathLibraryV2__factory, PathLibraryV2Final__factory  } from '../typechain'
import {
  getMainnetSdk,
  getGoerliSdk,
  getPolygonSdk,
  getPolygonMumbaiSdk,
  getArbitrumOneSdk,
  getArbitrumTestnetSdk,
  getOptimismSdk,
  getOptimismGoerliSdk,
  getAuroraSdk,
  getAuroraTestnetSdk
} from '@dethcrypto/eth-sdk-client'
import { ethers } from 'ethers'

declare const web3: any;

const relay = new GelatoRelay()

const sdks = {
  [chainIds.goerli]: getGoerliSdk,
  [chainIds.mainnet]: getMainnetSdk,
  [chainIds.polygon]: getPolygonSdk,
  [chainIds.polygonMumbai]: getPolygonMumbaiSdk,
  [chainIds.arbitrum]: getArbitrumOneSdk,
  [chainIds.arbitrumGoerli]: getArbitrumTestnetSdk,
  [chainIds.optimism]: getOptimismSdk,
  [chainIds.optimismGoerli]: getOptimismGoerliSdk,
  [chainIds.aurora]: getAuroraSdk,
  [chainIds.auroraTestnet]: getAuroraTestnetSdk
}

export default class Base {
  protected readonly _chainId: ChainIds
  protected readonly _ensProvider: Provider | undefined
  // TODO: something better we can do here to handle typescript check for missing signer?
  protected readonly _signer?: Signer
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
  }: ClientConfig) {
    if (includeEnsNames && !provider && !ensProvider)
      throw new InvalidConfigError(
        'Must include a mainnet provider if includeEnsNames is set to true',
      )

    this._ensProvider = ensProvider ?? provider
    this._provider = provider
    this._chainId = chainId
    this._signer = signer
    this._includeEnsNames = includeEnsNames
    this._revPathAddress = revPathAddress
  }

  protected _initV0RevPath() {
    const sdk =  sdks[this._chainId](this._signer || this._provider)

    if (!this._revPathAddress) return {
      sdk
    }

    const revPathV0Read = PathLibraryV0__factory.connect(
      this._revPathAddress,
      this._provider
    )
    const revPathV0Write = this._signer ? PathLibraryV0__factory.connect(
      this._revPathAddress,
      this._signer
    ) : undefined

    return {
      revPathV0Read,
      revPathV0Write,
      sdk
    }
  }

  protected _initV1RevPath() {
    const sdk =  sdks[this._chainId](this._signer || this._provider)

    if (!this._revPathAddress) return {
      sdk
    }

    const revPathV1Read = PathLibraryV1__factory.connect(
      this._revPathAddress,
      this._provider
    )
    const revPathV1Write = this._signer ? PathLibraryV1__factory.connect(
      this._revPathAddress,
      this._signer
    ) : undefined

    return {
      revPathV1Read,
      revPathV1Write,
      sdk
    }
  }
  
  async signatureCall(request: CallWithERC2771Request, gasLessKey: string) {
    const web3Provider = new ethers.providers.Web3Provider((web3 as any).currentProvider)
    const user = await this._signer?.getAddress()

    if (!user || !gasLessKey) throw new Error("Can't execute Gelato SDK.")

    const r = await relay.sponsoredCallERC2771(
      { ...request, user },
      web3Provider,
      gasLessKey
    )

    return r
  }

  protected _initV2RevPath() {
    const sdk = sdks[this._chainId](this._signer || this._provider)

    if (!this._revPathAddress) return {
      byPass: true,
      sdk,
      relay: {
        signatureCall: this.signatureCall.bind(this)
      }
    }

    const revPathV2Read = PathLibraryV2__factory.connect(
      this._revPathAddress,
      this._provider
    )
    const revPathV2Write = this._signer ? PathLibraryV2__factory.connect(
      this._revPathAddress,
      this._signer
    ) : undefined

    return {
      revPathV2Read,
      revPathV2Write,
      sdk,
      relay: {
        signatureCall: this.signatureCall.bind(this)
      }
    }
  }

  protected _initV2FinalRevPath() {
    const sdk = sdks[this._chainId](this._signer || this._provider)

    if (!this._revPathAddress) return {
      sdk,
    }

    const revPathV2FinalRead = PathLibraryV2Final__factory.connect(
      this._revPathAddress,
      this._provider
    )
    const revPathV2FinalWrite = this._signer ? PathLibraryV2Final__factory.connect(
      this._revPathAddress,
      this._signer
    ) : undefined

    return {
      revPathV2FinalRead,
      revPathV2FinalWrite,
      sdk,
      relay: {
        signatureCall: this.signatureCall.bind(this)
      }
    }
  }

  protected _requireProvider() {
    if (!this._provider)
      throw new MissingProviderError(
        'Provider required to perform this action, please update your call to the constructor',
      )
  }
}
