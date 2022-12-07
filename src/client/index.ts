import { MainnetSdk, GoerliSdk } from "@dethcrypto/eth-sdk-client"

import Base from "./base"

import type { SplitsClientConfig } from '../types'
import { PathLibraryV0, PathLibraryV1, PathLibraryV2 } from '../typechain'

import { withdrawableV0, FnArgs as WithdrawableV0Args } from '../withdrawableV0'
import { withdrawnV0, FnArgs as WithdrawnV0Args } from '../withdrawnV0'
import { withdrawableV1, FnArgs as WithdrawableV1Args } from '../withdrawableV1'
import { withdrawableV2, FnArgs as WithdrawableV2Args } from "../withdrawableV2"
import { withdrawnV1, FnArgs as WithdrawnV1Args } from '../withdrawnV1'
import { withdrawnFundsV2, FnArgs as WithdrawnV2Args } from "../withdrawnV2"
import { withdrawFundsV0, FnArgs as WithdrawV0Args } from "../withdrawV0"
import { withdrawFundsV1, FnArgs as WithdrawV1Args } from "../withdrawV1"
import { withdrawFundsV2, FnArgs as WithdrawV2Args } from "../withdrawV2"
import { getRevPathWithdrawEventsV0 } from "../eventsV0"
import { getRevPathWithdrawEventsV1 } from "../eventsV1"
import { getRevPathWithdrawEventsV2 } from "../eventsV2"
import { tiersV1, TierType as TierTypeV1, FnArgs as TiersV1Args } from "../tiersV1"
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
      init: () => {
        const { revPathV0, sdk } = this._initV0RevPath()

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
      init: () => {
        const { revPathV1, sdk } = this._initV1RevPath()

        this.revPathV1 = revPathV1
        this.sdk = sdk
        this.initialized = true
      },
      withdrawable: (args: WithdrawableV1Args) => withdrawableV1.call(this, args),
      withdrawn: (args: WithdrawnV1Args) => withdrawnV1.call(this, args),
      withdrawEvents: () => getRevPathWithdrawEventsV1.call(this),
      withdraw: (args: WithdrawV1Args) => withdrawFundsV1.call(this, args),
      tiers: (args: TiersV1Args) => tiersV1.call(this, args)
    }
  }

  get v2() {
    return {
      v: 2,
      init: () => {
        const { revPathV2, sdk } = this._initV2RevPath()

        this.revPathV2 = revPathV2
        this.sdk = sdk
        this.initialized = true
      },
      withdrawable: (args: WithdrawableV2Args) => withdrawableV2.call(this, args),
      withdrawn: (args: WithdrawnV2Args) => withdrawnFundsV2.call(this, args),
      withdrawEvents: () => getRevPathWithdrawEventsV2.call(this),
      withdraw: (args: WithdrawV2Args) => withdrawFundsV2.call(this, args)
    }
  }
}
