import { Provider } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { GelatoRelay, CallWithERC2771Request } from "@gelatonetwork/relay-sdk"
import { Polybase } from "@polybase/client";

import {
  InvalidConfigError,
  MissingProviderError,
  MissingSignerError
} from '../errors'

import type { ClientConfig } from '../types'
import { chainIds, ChainIds } from '../constants/tokens'
import { PathLibraryV0__factory, PathLibraryV1__factory, PathLibraryV2__factory, PathLibraryV2Final__factory, PathLibrarySimple__factory  } from '../typechain'
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
import axios from 'axios';
import { R3vlClient } from '.';

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

// const db = new Polybase({
//   defaultNamespace:
//     "pk/0xe8f7f7614541fab9e0f884b779d729c79806a77f9f83b7b249a0e18440c36d5f2a19cfb8f40f9fdc317fde32be13fb71366711f35d5cccf6d3a5095624e5c748/Test"
// })

// const collectionReference = db.collection("RevenuePath")

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
    const { _provider } = this
    const web3Provider = new ethers.providers.Web3Provider((web3 as any).currentProvider)
    const user = await this._signer?.getAddress()

    if (!user || !gasLessKey) throw new Error("Can't execute Gelato SDK.")

    const { taskId } = await relay.sponsoredCallERC2771(
      { ...request, user },
      web3Provider,
      gasLessKey
    )

    if (!taskId) {
      throw new Error("Couldn't get response from Gelato SDK")
    }

    let txHash
    let attempts = 0

    while (!txHash) {
      await new Promise((resolve) =>
        setTimeout(() => resolve(true), 10_000),
      )

      try {
        const { data } = await axios(
          "https://relay.gelato.digital/tasks/status/" + taskId,
        )

        if (data.task?.taskState === "Cancelled") {
          throw new Error(data.task?.lastCheckMessage)
        }

        txHash = data.task?.transactionHash
      } catch (error: any) {
        if (
          error?.response &&
          error.response?.status === 404 &&
          attempts === 18
        ) {
          attempts = attempts + 1

          continue
        }

        break
      }
    }

    const tx = await _provider.getTransaction(txHash)

    return tx
  }

  async authWallet() {
    const { _signer } = this
    const address = await _signer?.getAddress()

    const msgRes = await axios.get(`${R3vlClient.API_HOST}/api/message`, {
      params: { address }
    });

    const { messageToSign } = msgRes?.data || { messageToSign: null };

    if (!messageToSign) {
      throw new Error("Invalid message to sign")
    }

    const signature = await _signer?.signMessage?.(messageToSign)

    const jwtResponse = await axios.get(
      `${R3vlClient.API_HOST}/api/jwt?address=${address}&signature=${signature}`
    );

    const { customToken } = jwtResponse?.data || { customToken: null }

    if (!customToken) {
      throw new Error("Invalid JWT");
    }

    window.dispatchEvent(new CustomEvent('r3vl-sdk#authWallet'));

    return { customToken }
  }

  async signCreateRevenuePath(args: {
    address: string,
    name: string,
    walletList: string[][],
    distribution: number[][],
    limits?: { [t: string]: number | string }[]
    fBPayload: any
    isSimple: boolean
  }, customToken: string) {
    const { _chainId } = this
    // const { customToken } = await authWallet.call(this)

    await axios.post(`${R3vlClient.API_HOST}/api/revPathMetadata`, {
      chainId: _chainId,
      isSimple: args.isSimple,
      payload: args.fBPayload
    }, {
      headers: {
        Authorization: `Bearer ${customToken}`,
        'x-api-key': localStorage.getItem(`r3vl-sdk-apiKey`)
      },
    })

    await axios.get(`${R3vlClient.API_HOST}/revPaths?chainId=${_chainId}`)

    return args

    // const { _chainId, _signer } = this

    // const r = await collectionReference.create([
    //   `${_chainId}-${args.address}`,
    //   _chainId,
    //   args.name,
    //   await _signer?.getAddress() || "",
    //   JSON.stringify(args.walletList),
    //   JSON.stringify(args.distribution),
    //   JSON.stringify(args.limits)
    // ])

    // return r
  }

  async signUpdateRevenuePath(args: {
    address: string,
    walletList?: string[][],
    distribution?: number[][],
    limits?: { [t: string]: number | string }[]
    isSimple: boolean
  }, customToken: string) {
    const { _chainId } = this
    // const { customToken } = await authWallet.call(this)

    if (args.limits) {
      await axios.put(`${R3vlClient.API_HOST}/revPathMetadata`, {
        chainId: _chainId,
        address: args.address,
        tiers: args.limits,
        isSimple: args.isSimple
      },{
        headers: {
          Authorization: `Bearer ${customToken}`,
        'x-api-key': localStorage.getItem(`r3vl-sdk-apiKey`)
        },
      })

      return args
    }

    await axios.put(`${R3vlClient.API_HOST}/api/revPathMetadata`, {
      chainId: _chainId,
      address: args.address,
      walletList: args.walletList,
      distribution: args.distribution,
      isSimple: args.isSimple
    },{
      headers: {
        Authorization: `Bearer ${customToken}`,
        'x-api-key': localStorage.getItem(`r3vl-sdk-apiKey`)
      },
    })

    return args

    // const { _chainId } = this

    // const r = 
    //   await collectionReference.record(`${_chainId}-${args.address}`).call("updateTiers", [
    //     args.walletList ? JSON.stringify(args.walletList) : false,
    //     args.distribution ? JSON.stringify(args.distribution) : false,
    //     args.limits ? JSON.stringify(args.limits) : false
    //   ])

    // return r
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
      relay: {
        signatureCall: this.signatureCall.bind(this),
      },
      apiSigner: {
        signCreateRevenuePath: this.signCreateRevenuePath.bind(this),
        signUpdateRevenuePath: this.signUpdateRevenuePath.bind(this),
        authWallet: this.authWallet.bind(this)
      }
    }

    const revPathV2FinalRead = PathLibraryV2Final__factory.connect(
      this._revPathAddress,
      this._provider
    )
    const revPathV2FinalWrite = this._signer ? PathLibraryV2Final__factory.connect(
      this._revPathAddress,
      this._signer
    ) : undefined

    // if (this._signer) {
    //   const signer = this._signer

    //   db.signer(async (data) => {
    //     return {
    //       h: "eth-personal-sign",
    //       sig: await signer.signMessage(data)
    //     } as any;
    //   })
    // }

    return {
      revPathV2FinalRead,
      revPathV2FinalWrite,
      sdk,
      relay: {
        signatureCall: this.signatureCall.bind(this),
      },
      apiSigner: {
        signCreateRevenuePath: this.signCreateRevenuePath.bind(this),
        signUpdateRevenuePath: this.signUpdateRevenuePath.bind(this),
        authWallet: this.authWallet.bind(this)
      },
      getCurrentBlockNumber: async () => await this._provider.getBlockNumber()
    }
  }

  protected _initSimpleRevPath() {
    const sdk = sdks[this._chainId](this._signer || this._provider)

    if (!this._revPathAddress) return {
      sdk,
      relay: {
        signatureCall: this.signatureCall.bind(this),
      },
      apiSigner: {
        signCreateRevenuePath: this.signCreateRevenuePath.bind(this),
        signUpdateRevenuePath: this.signUpdateRevenuePath.bind(this),
        authWallet: this.authWallet.bind(this)
      }
    }

    const revPathSimpleRead = PathLibrarySimple__factory.connect(
      this._revPathAddress,
      this._provider
    )
    const revPathSimpleWrite = this._signer ? PathLibrarySimple__factory.connect(
      this._revPathAddress,
      this._signer
    ) : undefined

    // if (this._signer) {
    //   const signer = this._signer

    //   db.signer(async (data) => {
    //     return {
    //       h: "eth-personal-sign",
    //       sig: await signer.signMessage(data)
    //     } as any;
    //   })
    // }

    return {
      revPathSimpleRead,
      revPathSimpleWrite,
      sdk,
      relay: {
        signatureCall: this.signatureCall.bind(this),
      },
      apiSigner: {
        signCreateRevenuePath: this.signCreateRevenuePath.bind(this),
        signUpdateRevenuePath: this.signUpdateRevenuePath.bind(this),
        authWallet: this.authWallet.bind(this)
      },
      getCurrentBlockNumber: async () => await this._provider.getBlockNumber()
    }
  }

  protected _requireProvider() {
    if (!this._provider)
      throw new MissingProviderError(
        'Provider required to perform this action, please update your call to the constructor',
      )
  }
}
