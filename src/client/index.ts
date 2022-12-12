import { ethers } from "ethers"
import { MainnetSdk, GoerliSdk } from "@dethcrypto/eth-sdk-client"

import Base from "./base"

import type { SplitsClientConfig } from '../types'
import { PathLibraryV0, PathLibraryV1, PathLibraryV2 } from '../typechain'

import { withdrawableV0, FnArgs as WithdrawableV0Args } from '../withdrawableV0'
import { withdrawnV0, FnArgs as WithdrawnV0Args } from '../withdrawnV0'
import { withdrawableV1, FnArgs as WithdrawableV1Args } from '../withdrawableV1'
import { withdrawableV2, FnArgs as WithdrawableV2Args } from "../withdrawableV2"
import { withdrawnV1, FnArgs as WithdrawnV1Args } from '../withdrawnV1'

import { updateRevenueTierV1, UpdateRevenueTierV1Args } from "../updateRevenueTierV1"
import { updateFinalFund, UpdateFinalFundArgs } from "../updateFinalFund"
import { updateErc20Distribution, UpdateErc20DistributionArgs } from "../updateErc20Distribution"
import { addRevenueTierV1, AddRevenueTierV1Args } from "../addRevenueTierV1"

import { withdrawnFundsV2, FnArgs as WithdrawnV2Args } from "../withdrawnV2"
import { withdrawFundsV0, FnArgs as WithdrawV0Args } from "../withdrawV0"
import { withdrawFundsV1, FnArgs as WithdrawV1Args } from "../withdrawV1"
import { withdrawFundsV2, FnArgs as WithdrawV2Args } from "../withdrawV2"
import { getRevPathWithdrawEventsV0 } from "../eventsV0"
import { getRevPathWithdrawEventsV1 } from "../eventsV1"
import { getRevPathWithdrawEventsV2 } from "../eventsV2"
import { tiersV1, TierType as TierTypeV1, FnArgs as TiersV1Args } from "../tiersV1"
import { updateRevenueTiersV2, FnArgs as UpdateRevenueTiersV2Args } from "../updateRevenueTiersV2"
import { updateLimitsV2, FnArgs as UpdateLimitsV2Args } from "../updateLimitsV2"
import { addRevenueTiersV2, FnArgs as AddRevenueTiersV2Args } from "../addRevenueTiersV2"
import { createRevenuePathV1, FnArgs as CreateRevenuePathV1Args } from "../createRevenuePathV1"
import { createRevenuePathV2, FnArgs as CreateRevenuePathV2Args } from "../createRevenuePathV2"
import { PaymentReleasedEvent as PaymentReleasedEventV0 } from "../typechain/PathLibraryV0"
import { PaymentReleasedEvent as PaymentReleasedEventV1 } from "../typechain/PathLibraryV1"
import { PaymentReleasedEvent as PaymentReleasedEventV2 } from "../typechain/PathLibraryV2"


export type RevenuePath = {
  v: number
  init: () => void
  withdrawable: (args: WithdrawableV1Args) => Promise<number | false | undefined>
  withdrawn: (args: WithdrawnV1Args) => Promise<number | false | undefined>
  withdrawEvents: () => Promise<PaymentReleasedEventV0[] | PaymentReleasedEventV1[] | PaymentReleasedEventV2[] | undefined>
  withdraw: (args: WithdrawV1Args) => void
  tiers?: (args: TiersV1Args) => Promise<TierTypeV1[] | undefined>
  createRevenuePath?: (args: CreateRevenuePathV1Args | CreateRevenuePathV2Args | any /* TODO: remove any */) => Promise<ethers.ContractReceipt | undefined>
  updateRevenueTier?: (args: UpdateRevenueTierV1Args) => Promise<ethers.ContractReceipt | undefined>
  updateErc20Distribution?: (args: UpdateErc20DistributionArgs) => Promise<ethers.ContractReceipt | undefined>
  updateFinalFund?: (args: UpdateFinalFundArgs) => Promise<void>
  addRevenueTiers?: (args: AddRevenueTiersV2Args) => Promise<ethers.ContractReceipt | undefined>
  updateLimits?: (args: UpdateLimitsV2Args) => Promise<ethers.ContractReceipt | undefined>
  addRevenueTier?: (args: AddRevenueTierV1Args) => Promise<ethers.ContractReceipt | undefined>
  updateRevenueTiers?: (args: UpdateRevenueTiersV2Args) => Promise<ethers.ContractReceipt | undefined>
}

export class R3vlClient extends Base {
  revPathV0: PathLibraryV0 | undefined
  revPathV1: PathLibraryV1 | undefined
  revPathV2: PathLibraryV2 | undefined
  sdk: MainnetSdk | GoerliSdk | undefined
  initialized = false

  constructor({
    chainId,
    provider,
    signer,
    includeEnsNames = false,
    ensProvider,
    revPathAddress
  }: SplitsClientConfig) {
    super({
      chainId,
      provider,
      ensProvider,
      signer,
      includeEnsNames,
      revPathAddress
    })
  }
  
  get v0() {
    return {
      v: 0,
      init: ({ signer }: { signer?: boolean } = {}) => {
        const { revPathV0, sdk } = this._initV0RevPath({ signer })

        this.revPathV0 = revPathV0
        this.sdk = sdk
        this.initialized = true
      },
      withdrawable: (args: WithdrawableV0Args) => withdrawableV0.call(this, args),
      withdrawn: (args: WithdrawnV0Args) => withdrawnV0.call(this, args),
      withdrawEvents: () => getRevPathWithdrawEventsV0.call(this),
      withdraw: (args: WithdrawV0Args) => withdrawFundsV0.call(this, args)
    }
  }

  get v1() {
    return {
      v: 1,
      init: ({ signer }: { signer?: boolean } = {}) => {
        const { revPathV1, sdk } = this._initV1RevPath({ signer })

        this.revPathV1 = revPathV1
        this.sdk = sdk
        this.initialized = true
      },
      withdrawable: (args: WithdrawableV1Args) => withdrawableV1.call(this, args),
      withdrawn: (args: WithdrawnV1Args) => withdrawnV1.call(this, args),
      createRevenuePath: (args: CreateRevenuePathV1Args) => createRevenuePathV1.call(this, args),
      updateRevenueTier: (args: UpdateRevenueTierV1Args) => updateRevenueTierV1.call(this, args),
      updateErc20Distribution: (args: UpdateErc20DistributionArgs) => updateErc20Distribution.call(this, args),
      updateFinalFund: (args: UpdateFinalFundArgs) => updateFinalFund.call(this, args),
      addRevenueTier: (args: AddRevenueTierV1Args) => addRevenueTierV1.call(this, args),
      withdrawEvents: () => getRevPathWithdrawEventsV1.call(this),
      withdraw: (args: WithdrawV1Args) => withdrawFundsV1.call(this, args),
      tiers: (args: TiersV1Args) => tiersV1.call(this, args)
    }
  }

  get v2() {
    return {
      v: 2,
      init: ({ signer }: { signer?: boolean } = {}) => {
        const { revPathV2, sdk } = this._initV2RevPath({ signer })

        this.revPathV2 = revPathV2
        this.sdk = sdk
        this.initialized = true
      },
      withdrawable: (args: WithdrawableV2Args) => withdrawableV2.call(this, args),
      withdrawn: (args: WithdrawnV2Args) => withdrawnFundsV2.call(this, args),
      withdrawEvents: () => getRevPathWithdrawEventsV2.call(this),
      withdraw: (args: WithdrawV2Args) => withdrawFundsV2.call(this, args),
      createRevenuePath: (args: CreateRevenuePathV2Args) => createRevenuePathV2.call(this, args),
      updateRevenueTiers: (args: UpdateRevenueTiersV2Args) => updateRevenueTiersV2.call(this, args),
      updateLimits: (args: UpdateLimitsV2Args) => updateLimitsV2.call(this, args),
      addRevenueTiers: (args: AddRevenueTiersV2Args) => addRevenueTiersV2.call(this, args),
    }
  }
}
