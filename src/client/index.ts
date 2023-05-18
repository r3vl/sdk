import { ethers } from "ethers"
import { MainnetSdk, GoerliSdk, PolygonSdk, PolygonMumbaiSdk, ArbitrumOneSdk, ArbitrumTestnetSdk } from "@dethcrypto/eth-sdk-client"
import { RelayResponse } from "@gelatonetwork/relay-sdk"

import Base from "./base"

import type { ClientConfig } from '../types'
import { PathLibraryV0, PathLibraryV1, PathLibraryV2, PathLibraryV2Final } from '../typechain'

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
import { getRevenuePathsV0 } from "../eventsV0"
import { getRevenuePathsV1 } from "../eventsV1"
import { getRevenuePathsV2, getRevPathTransactionEventsV2 } from "../eventsV2"
import { getRevenuePathsV2Final, getRevPathTransactionEventsV2Final } from "../eventsV2Final"
import { tiersV1, FnArgs as TiersV1Args } from "../tiersV1"
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

export type RevenuePath = {
  v: number
  init: () => void
  withdrawable?: (args?: WithdrawableV0Args | WithdrawableV1Args | WithdrawableV2Args) => Promise<any | undefined>
  withdrawn?: (args?: WithdrawnV0Args | WithdrawnV1Args | WithdrawnV2Args, getBN?: boolean) => Promise<number | undefined>
  transactionEvents?: (rePath: string) => Promise<any> | ReturnType<typeof getRevPathTransactionEventsV2>
  revenuePaths?: () => Promise<RevenuePathsList | any>
  withdraw?: (args: WithdrawV1Args) => void
  withdrawGasLess?: (args: WithdrawV1Args, opts: { gasLessKey: string }) => Promise<any>
  tiers?: (args?: TiersV1Args) => ReturnType<typeof tiersV1> | ReturnType<typeof tiersV2>
  createRevenuePath?: (args: CreateRevenuePathV1Args | CreateRevenuePathV2Args | any /* TODO: remove any */, opts?: { customGasLimit?: number; isGasLess?: boolean; gasLessKey?: string }) => Promise<undefined | ethers.ContractReceipt | ethers.ContractTransaction | RelayResponse>
  updateRevenueTier?: (args: UpdateRevenueTierV1Args) => Promise<ethers.ContractReceipt | undefined>
  updateErc20Distribution?: (args: UpdateErc20DistributionArgs) => Promise<ethers.ContractReceipt | undefined>
  updateFinalFund?: (args: UpdateFinalFundArgs) => Promise<void>
  addRevenueTiers?: (args: AddRevenueTiersV2Args) => Promise<ethers.ContractReceipt | undefined>
  updateLimits?: (args: UpdateLimitsV2Args) => Promise<ethers.ContractReceipt | undefined>
  addRevenueTier?: (args: AddRevenueTierV1Args) => Promise<ethers.ContractReceipt | undefined>
  updateRevenueTiers?: (args: UpdateRevenueTiersV2Args) => Promise<ethers.ContractReceipt | ethers.ContractTransaction | undefined>
  transferOwnerhip?: (args: any) => Promise<any>
}

export class R3vlClient extends Base {
  revPathV0Read?: PathLibraryV0
  revPathV0Write?: PathLibraryV0
  revPathV1Read?: PathLibraryV1
  revPathV1Write?: PathLibraryV1
  revPathV2Read?: PathLibraryV2
  revPathV2Write?: PathLibraryV2
  revPathV2FinalRead?: PathLibraryV2Final
  sdk?: MainnetSdk | GoerliSdk | PolygonSdk | PolygonMumbaiSdk | ArbitrumOneSdk | ArbitrumTestnetSdk
  relay?: { signatureCall: any }
  revPathMetadata?: { walletList: [[string]]; distribution: [[number]], tiers: {[t: string]: number}[] }
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
    initV2Final?: boolean
    revPathMetadata?: { walletList: [[string]]; distribution: [[number]], tiers: {[t: string]: number}[] }
  }) {
    const { v0, v1 , v2, v2Final } = this

    const byPass = v2.init()
    v2Final.init()
    v1.init()
    v0.init()

    if (opts?.revPathMetadata) this.revPathMetadata = opts?.revPathMetadata

    if (opts?.initV0) return v0
    if (opts?.initV1) return v1
    if (opts?.initV2Final) return v2Final
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
      revenuePaths: () => getRevenuePathsV0.call(this),
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
      createRevenuePath: (args: CreateRevenuePathV1Args, opts?: { customGasLimit?: number }) => createRevenuePathV1.call(this, args, opts),
      updateRevenueTier: (args: UpdateRevenueTierV1Args) => updateRevenueTierV1.call(this, args),
      updateErc20Distribution: (args: UpdateErc20DistributionArgs) => updateErc20Distribution.call(this, args),
      updateFinalFund: (args: UpdateFinalFundArgs) => updateFinalFund.call(this, args),
      addRevenueTier: (args: AddRevenueTierV1Args) => addRevenueTierV1.call(this, args),
      // transactionEvents: () => getRevPathWithdrawEventsV1.call(this),
      revenuePaths: () => getRevenuePathsV1.call(this),
      withdraw: (args: WithdrawV1Args) => withdrawFundsV1.call(this, args),
      tiers: (args?: TiersV1Args) => tiersV1.call(this, args as any)
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
      revenuePaths: () => getRevenuePathsV2.call(this),
      withdraw: (args: WithdrawV2Args) => withdrawFundsV2.call(this, args),
      withdrawGasLess: (args: WithdrawV2Args, opts: { gasLessKey: string }) => withdrawFundsGasLessV2.call(this, args, opts),
      createRevenuePath: (args: CreateRevenuePathV2Args, opts?: { customGasLimit?: number, isGasLess?: boolean, gasLessKey?: string }) => createRevenuePathV2.call(this, args, opts),
      updateRevenueTiers: (args: UpdateRevenueTiersV2Args) => updateRevenueTiersV2.call(this, args),
      updateLimits: (args: UpdateLimitsV2Args) => updateLimitsV2.call(this, args),
      addRevenueTiers: (args: AddRevenueTiersV2Args) => addRevenueTiersV2.call(this, args),
      tiers: () => tiersV2.call(this),
      transferOwnerhip: (newOwner: AddressInput) => transferOwnershipV2.call(this, newOwner)
    }
  }

  get v2Final() {
    return {
      v: 20,
      init: () => {
        const { sdk, revPathV2FinalRead } = this._initV2FinalRevPath()

        this.revPathV2FinalRead = revPathV2FinalRead
        this.sdk = sdk
      },
      withdrawable: (args?: WithdrawableV2Args) => withdrawableV2Final.call(this, args),
      withdrawn: (args?: WithdrawnV2Args) => withdrawnFundsV2Final.call(this, args),
      transactionEvents: (revPath: string) => getRevPathTransactionEventsV2Final.call(this, revPath),
      revenuePaths: () => getRevenuePathsV2Final.call(this),
      tiers: () => tiersV2Final.call(this),
      createRevenuePath: (args: CreateRevenuePathV2Args, opts?: { customGasLimit?: number, isGasLess?: boolean}) => createRevenuePathV2Final.call(this, args, opts),
    }
  }
}
