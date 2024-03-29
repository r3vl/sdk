import { ethers } from "ethers"
import { MainnetSdk, GoerliSdk, PolygonSdk, PolygonMumbaiSdk, ArbitrumOneSdk, ArbitrumTestnetSdk, BaseSdk } from "@dethcrypto/eth-sdk-client"
import { RelayResponse } from "@gelatonetwork/relay-sdk"
import axios from "axios"

import Base from "./base"

import type { ClientConfig } from '../types'
import { PathLibrarySimple, PathLibraryV0, PathLibraryV1, PathLibraryV2, PathLibraryV2Final } from '../typechain'

import { AddressInput } from "../react"

import { transferOwnershipV2 } from "../transferOwnershipV2"

import { FnArgs as WithdrawableV0Args } from '../withdrawableV0'
import { withdrawnV0, FnArgs as WithdrawnV0Args } from '../withdrawnV0'
import {  FnArgs as WithdrawableV1Args } from '../withdrawableV1'
import { withdrawableV2, FnArgs as WithdrawableV2Args } from "../withdrawableV2"
import { withdrawableV2Final } from "../withdrawableV2Final"
import { withdrawnV1, FnArgs as WithdrawnV1Args } from '../withdrawnV1'

import { updateRevenueTierV1, UpdateRevenueTierV1Args } from "../updateRevenueTierV1"
import { updateFinalFund, UpdateFinalFundArgs } from "../updateFinalFund"
import { updateErc20Distribution, UpdateErc20DistributionArgs } from "../updateErc20Distribution"
import { addRevenueTierV1, AddRevenueTierV1Args } from "../addRevenueTierV1"

import { withdrawnFundsV2, FnArgs as WithdrawnV2Args } from "../withdrawnV2"
import { withdrawnFundsV2Final } from "../withdrawnV2Final"
import { withdrawFundsV0, FnArgs as WithdrawV0Args } from "../withdrawV0"
import { withdrawFundsV1, FnArgs as WithdrawV1Args } from "../withdrawV1"
import { withdrawFundsV2, FnArgs as WithdrawV2Args, withdrawFundsGasLessV2 } from "../withdrawV2"
import { withdrawFundsV2Final, FnArgs as WithdrawV2FinalArgs } from "../withdrawV2Final"
import { getRevenuePathsV0 } from "../eventsV0"
import { getRevenuePathsV1 } from "../eventsV1"
import { getRevenuePathsV2, getRevPathTransactionEventsV2 } from "../eventsV2"
import { getRevenuePathsV2Final, getRevPathTransactionEventsV2Final } from "../eventsV2Final"
import { tiersV1 } from "../tiersV1"
import { tiersV2 } from "../tiersV2"
import { tiersV2Final } from "../tiersV2Final"
import { updateRevenueTiersV2, FnArgs as UpdateRevenueTiersV2Args } from "../updateRevenueTiersV2"
import { updateLimitsV2, FnArgs as UpdateLimitsV2Args } from "../updateLimitsV2"
import { addRevenueTiersV2, FnArgs as AddRevenueTiersV2Args } from "../addRevenueTiersV2"
import { createRevenuePathV1, FnArgs as CreateRevenuePathV1Args } from "../createRevenuePathV1"
import { createRevenuePathV2, FnArgs as CreateRevenuePathV2Args } from "../createRevenuePathV2"
import { createRevenuePathV2Final } from "../createRevenuePathV2Final"
import { RevenuePathCreatedEvent as RevenuePathCreatedEventV0 } from "../typechain/ReveelMainV0"
import { RevenuePathCreatedEvent as RevenuePathCreatedEventV1 } from "../typechain/ReveelMainV1"
import { RevenuePathCreatedEvent as RevenuePathCreatedEventV2 } from "../typechain/ReveelMainV2"
import { transferOwnershipV2Final } from "../transferOwnershipV2Final"
import { updateRevenueTiersV2Final } from "../updateRevenueTiersV2Final"
import { updateLimitsV2Final } from "../updateLimitsV2Final"
import { withdrawableSimple, FnArgs as WithdrawableSimpleArgs } from "../withdrawableSimple"
import { withdrawnFundsSimple } from "../withdrawnSimple"
import { withdrawFundsSimple } from "../withdrawSimple"
import { getRevenuePathsSimple, getRevPathTransactionEventsSimple } from "../eventsSimple"
import { createRevenuePathSimple } from "../createRevenuePathSimple"
import { updateRevenueTiersSimple } from "../updateRevenueTiersSimple"
import { tiersSimple } from "../tiersSimple"

export type RevenuePathsList = {
  address: string
  isUserInPath: boolean
  contract:
    MainnetSdk["pathLibraryV0"] |
    MainnetSdk["pathLibraryV1"] |
    MainnetSdk["pathLibraryV2"],
  eventPayload:
    RevenuePathCreatedEventV0 |
    RevenuePathCreatedEventV1 |
    RevenuePathCreatedEventV2
}[]

export type GeneralOpts = {
  customGasLimit?: number;
  revPathMetadata?: string
}

export type GaslessOpts = {
  isGasLess?: boolean;
  gasLessKey?: string
}

export type RevenuePath = {
  v: number
  init: () => void
  withdrawable?: (args?: WithdrawableV0Args | WithdrawableV1Args | WithdrawableV2Args) => Promise<any | undefined>
  withdrawn?: (args?: WithdrawnV0Args | WithdrawnV1Args | WithdrawnV2Args, getBN?: boolean) => Promise<number | undefined>
  transactionEvents?: (rePath: string) => Promise<any> | ReturnType<typeof getRevPathTransactionEventsV2>
  revenuePaths?: (args?: { startBlock?: number }) => Promise<RevenuePathsList | any>
  withdraw?: (args: any, opts?: GaslessOpts) => any
  withdrawGasLess?: (args: WithdrawV1Args, opts: { gasLessKey: string }) => Promise<any>
  tiers?: (opts?: GeneralOpts) => ReturnType<typeof tiersV1> | ReturnType<typeof tiersV2> | ReturnType<typeof tiersSimple>
  createRevenuePath?: (args: CreateRevenuePathV1Args | CreateRevenuePathV2Args | any /* TODO: remove any */, opts?: GeneralOpts & GaslessOpts) => Promise<undefined | ethers.ContractReceipt | ethers.ContractTransaction | RelayResponse>
  updateRevenueTier?: (args: UpdateRevenueTierV1Args) => Promise<ethers.ContractReceipt | undefined>
  updateErc20Distribution?: (args: UpdateErc20DistributionArgs) => Promise<ethers.ContractReceipt | undefined>
  updateFinalFund?: (args: UpdateFinalFundArgs) => Promise<void>
  addRevenueTiers?: (args: AddRevenueTiersV2Args) => Promise<ethers.ContractReceipt | undefined>
  updateLimits?: (args: UpdateLimitsV2Args) => Promise<ethers.ContractReceipt | undefined>
  addRevenueTier?: (args: AddRevenueTierV1Args) => Promise<ethers.ContractReceipt | undefined>
  updateRevenueTiers?: (args: UpdateRevenueTiersV2Args) => Promise<ethers.ContractReceipt | ethers.ContractTransaction | undefined>
  transferOwnerhip?: (args: any, opts?: GaslessOpts) => Promise<any>
}

export class R3vlClient extends Base {
  static API_HOST = "https://us-central1-ui-v2-66a48.cloudfunctions.net"

  revPathV0Read?: PathLibraryV0
  revPathV0Write?: PathLibraryV0
  revPathV1Read?: PathLibraryV1
  revPathV1Write?: PathLibraryV1
  revPathV2Read?: PathLibraryV2
  revPathV2Write?: PathLibraryV2
  revPathV2FinalRead?: PathLibraryV2Final
  revPathV2FinalWrite?: PathLibraryV2Final
  revPathSimpleRead?: PathLibrarySimple
  revPathSimpleWrite?: PathLibrarySimple
  sdk?: MainnetSdk | GoerliSdk | PolygonSdk | PolygonMumbaiSdk | ArbitrumOneSdk | ArbitrumTestnetSdk | BaseSdk
  relay?: { signatureCall: any }
  apiSigner?: { signCreateRevenuePath: any, signUpdateRevenuePath: any, authWallet: () => Promise<{ customToken: string }> }
  revPathMetadata?: { walletList: [[string]]; distribution: [[number]], tiers: {[t: string]: number}[] }
  getCurrentBlockNumber?: () => Promise<number>
  initialized = false

  constructor({
    chainId,
    provider,
    signer,
    includeEnsNames = false,
    ensProvider,
    revPathAddress
  }: ClientConfig) {
    super({
      chainId,
      provider,
      ensProvider,
      signer,
      includeEnsNames,
      revPathAddress
    })
  }

  async init(opts?: {
    initV0?: boolean
    initV1?: boolean
    initV2?: boolean
    initSimple?: boolean
    initV2Final?: boolean
    revPathMetadata?: { walletList: [[string]]; distribution: [[number]], tiers: {[t: string]: number}[] }
    apiKey?: string
  }) {
    const { v0, v1 , v2, v2Final, simple } = this

    const byPass = v2.init()
    simple.init()
    v2Final.init()
    v1.init()
    v0.init()

    const isMetadataRequired = opts?.initV2Final || opts?.initSimple

    if (isMetadataRequired && opts?.apiKey)
    localStorage.setItem(`r3vl-sdk-apiKey`, opts.apiKey)

    if (isMetadataRequired && this._revPathAddress) {
      if (!opts?.revPathMetadata && !opts?.apiKey) throw new Error("Couldn't initialize V2 Revenue Path")

      if (opts?.revPathMetadata) localStorage.setItem(`r3vl-metadata-${this._revPathAddress}`, JSON.stringify(opts?.revPathMetadata))

      if (opts?.apiKey) {
        try {
          const response = await axios.get(`${R3vlClient.API_HOST}/api/revPathMetadata?chainId=${this._chainId}&${this._revPathAddress}`, {
            headers: {
              Authorization: `Bearer ${opts.apiKey}`
            }
          })
          const [{ metadata }] = response.data
    
          localStorage.setItem(`r3vl-metadata-${this._revPathAddress}`, { ...metadata, isSimple: opts.initSimple })
        } catch (_err) {
          throw new Error("Couldn't find metadata for V2 Revenue Path")
        }
      }
    }

    if (opts?.initV0) return v0
    if (opts?.initV1) return v1
    if (opts?.initV2Final) return v2Final
    if (opts?.initSimple) return simple
    if (byPass === true || opts?.initV2) return v2

    return v2
  }

  get v0() {
    return {
      v: 0,
      init: () => {
        const { revPathV0Read, revPathV0Write, sdk } = this._initV0RevPath()

        this.revPathV0Read = revPathV0Read
        this.revPathV0Write = revPathV0Write
        this.sdk = sdk
        this.initialized = true
      },
      // withdrawable: (args?: WithdrawableV0Args) => withdrawableV0.call(this, args),
      withdrawn: (args?: WithdrawnV0Args) => withdrawnV0.call(this, args),
      // transactionEvents: () => getRevPathWithdrawEventsV0.call(this),
      revenuePaths: (args?: { startBlock?: number }) => getRevenuePathsV0.call(this, args),
      withdraw: (args: WithdrawV0Args) => withdrawFundsV0.call(this, args)
    }
  }

  get v1() {
    return {
      v: 1,
      init: () => {
        const { revPathV1Read, revPathV1Write, sdk } = this._initV1RevPath()

        this.revPathV1Read = revPathV1Read
        this.revPathV1Write = revPathV1Write
        this.sdk = sdk
        this.initialized = true
      },
      // withdrawable: (args?: WithdrawableV1Args) => withdrawableV1.call(this, args),
      withdrawn: (args?: WithdrawnV1Args) => withdrawnV1.call(this, args),
      createRevenuePath: (args: CreateRevenuePathV1Args, opts?: GeneralOpts) => createRevenuePathV1.call(this, args, opts),
      updateRevenueTier: (args: UpdateRevenueTierV1Args) => updateRevenueTierV1.call(this, args),
      updateErc20Distribution: (args: UpdateErc20DistributionArgs) => updateErc20Distribution.call(this, args),
      updateFinalFund: (args: UpdateFinalFundArgs) => updateFinalFund.call(this, args),
      addRevenueTier: (args: AddRevenueTierV1Args) => addRevenueTierV1.call(this, args),
      // transactionEvents: () => getRevPathWithdrawEventsV1.call(this),
      revenuePaths: (args?: { startBlock?: number }) => getRevenuePathsV1.call(this, args),
      withdraw: (args: WithdrawV1Args) => withdrawFundsV1.call(this, args),
      tiers: () => tiersV1.call(this)
    }
  }

  get v2() {
    return {
      v: 2,
      init: () => {
        const { revPathV2Read, revPathV2Write, sdk, byPass, relay } = this._initV2RevPath()

        this.sdk = sdk
        this.relay = relay
        this.initialized = true

        if (byPass) return true

        this.revPathV2Read = revPathV2Read
        this.revPathV2Write = revPathV2Write
      },
      withdrawable: (args?: WithdrawableV2Args) => withdrawableV2.call(this, args),
      withdrawn: (args?: WithdrawnV2Args) => withdrawnFundsV2.call(this, args),
      transactionEvents: (revPath: string) => getRevPathTransactionEventsV2.call(this, revPath),
      revenuePaths: (args?: { startBlock?: number }) => getRevenuePathsV2.call(this, args),
      withdraw: (args: WithdrawV2Args) => withdrawFundsV2.call(this, args),
      withdrawGasLess: (args: WithdrawV2Args, opts: { gasLessKey: string }) => withdrawFundsGasLessV2.call(this, args, opts),
      createRevenuePath: (args: CreateRevenuePathV2Args, opts?: GeneralOpts & GaslessOpts) => createRevenuePathV2.call(this, args, opts),
      updateRevenueTiers: (args: UpdateRevenueTiersV2Args) => updateRevenueTiersV2.call(this, args),
      updateLimits: (args: UpdateLimitsV2Args) => updateLimitsV2.call(this, args),
      addRevenueTiers: (args: AddRevenueTiersV2Args) => addRevenueTiersV2.call(this, args),
      tiers: () => tiersV2.call(this),
      transferOwnerhip: (newOwner: AddressInput, opts?: GeneralOpts & GaslessOpts) => transferOwnershipV2.call(this, newOwner, opts)
    }
  }

  get v2Final() {
    return {
      v: 20,
      init: () => {
        const {
          sdk,
          revPathV2FinalRead,
          revPathV2FinalWrite,
          apiSigner,
          relay,
          getCurrentBlockNumber
        } = this._initV2FinalRevPath()

        this.relay = relay
        this.revPathV2FinalRead = revPathV2FinalRead
        this.revPathV2FinalWrite = revPathV2FinalWrite
        this.sdk = sdk
        this.apiSigner = apiSigner
        this.getCurrentBlockNumber = getCurrentBlockNumber
      },
      withdrawable: (args?: WithdrawableV2Args) => withdrawableV2Final.call(this, args),
      withdrawn: (args?: WithdrawnV2Args) => withdrawnFundsV2Final.call(this, args),
      withdraw: (args: WithdrawV2FinalArgs, opts?: GaslessOpts) => withdrawFundsV2Final.call(this, args, opts),
      transactionEvents: (revPath: string) => getRevPathTransactionEventsV2Final.call(this, revPath),
      createRevenuePath: (args: CreateRevenuePathV2Args, opts?: GeneralOpts & GaslessOpts) => createRevenuePathV2Final.call(this, args, opts),
      updateRevenueTiers: (args: UpdateRevenueTiersV2Args) => updateRevenueTiersV2Final.call(this, args),
      updateLimits: (args: UpdateLimitsV2Args) => updateLimitsV2Final.call(this, args),
      revenuePaths: (args?: { startBlock?: number }) => getRevenuePathsV2Final.call(this, args),
      transferOwnerhip: (newOwner: AddressInput, opts?: GeneralOpts & GaslessOpts) => transferOwnershipV2Final.call(this, newOwner, opts),
      tiers: (opts?: GeneralOpts) => tiersV2Final.call(this, opts),
    }
  }

  get simple() {
    return {
      v: 21,
      init: () => {
        const {
          sdk,
          revPathSimpleRead,
          revPathSimpleWrite,
          apiSigner,
          relay,
          getCurrentBlockNumber
        } = this._initSimpleRevPath()

        this.relay = relay
        this.revPathSimpleRead = revPathSimpleRead
        this.revPathSimpleWrite = revPathSimpleWrite
        this.sdk = sdk
        this.apiSigner = apiSigner
        this.getCurrentBlockNumber = getCurrentBlockNumber
      },
      withdrawable: (args?: WithdrawableSimpleArgs) => withdrawableSimple.call(this, args),
      withdrawn: (args?: WithdrawnV2Args) => withdrawnFundsSimple.call(this, args),
      withdraw: (args: WithdrawV2FinalArgs, opts?: GaslessOpts) => withdrawFundsSimple.call(this, args, opts),
      transactionEvents: (revPath: string) => getRevPathTransactionEventsSimple.call(this, revPath),
      createRevenuePath: (args: CreateRevenuePathV2Args, opts?: GeneralOpts & GaslessOpts) => createRevenuePathSimple.call(this, args, opts),
      updateRevenueTiers: (args: UpdateRevenueTiersV2Args) => updateRevenueTiersSimple.call(this, args),
      revenuePaths: (args?: { startBlock?: number }) => getRevenuePathsSimple.call(this, args),
      // transferOwnerhip: (newOwner: AddressInput, opts?: GeneralOpts & GaslessOpts) => transferOwnershipSimple.call(this, newOwner, opts),
      tiers: (opts?: GeneralOpts) => tiersSimple.call(this, opts),
    }
  }
}
