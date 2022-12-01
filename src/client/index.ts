import { MainnetSdk, GoerliSdk } from "@dethcrypto/eth-sdk-client"

import Base from "./base"

import type { SplitsClientConfig } from '../types'
import { PathLibraryV0, PathLibraryV1 } from '../typechain'

import { withdrawableV0, FnArgs as WithdrawableV0Args } from '../withdrawableV0'
import { withdrawnV0, FnArgs as WithdrawnV0Args } from '../withdrawnV0'
import { withdrawableV1, FnArgs as WithdrawableV1Args } from '../withdrawableV1'
import { withdrawnV1, FnArgs as WithdrawnV1Args } from '../withdrawnV1'
import { getWithdrawEventsV0 } from "../eventsV0"
import { getWithdrawEventsV1 } from "../eventsV1"
import { updateRevenueTierV1, UpdateRevenueTierV1Args } from "../updateRevenueTierV1"
import { updateFinalFund, UpdateFinalFundArgs } from "../updateFinalFund"
import { updateErc20Distribution, UpdateErc20DistributionArgs } from "../updateErc20Distribution"
import { addRevenueTierV1, AddRevenueTierV1Args } from "../addRevenueTierV1"

export class R3vlClient extends Base {
  revPathV0: PathLibraryV0 | undefined
  revPathV1: PathLibraryV1 | undefined
  sdk: MainnetSdk | undefined

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
      init: () => {
        const { revPathV0, sdk } = this._initV0RevPath()

        this.revPathV0 = revPathV0
        this.sdk = sdk
      },
      withdrawable: (args: WithdrawableV0Args) => withdrawableV0.call(this, args),
      withdrawn: (args: WithdrawnV0Args) => withdrawnV0.call(this, args),
      withdrawEvents: () => getWithdrawEventsV0.call(this)
    }
  }

  get v1() {
    return {
      init: () => {
        const { revPathV1, sdk } = this._initV1RevPath()

        this.revPathV1 = revPathV1
        this.sdk = sdk
      },
      withdrawable: (args: WithdrawableV1Args) => withdrawableV1.call(this, args),
      withdrawn: (args: WithdrawnV1Args) => withdrawnV1.call(this, args),
      withdrawEvents: () => getWithdrawEventsV1.call(this),
      requireSigner: () => {
        const { revPathV1, sdk } = this._requireSigner()

        this.revPathV1 = revPathV1
        this.sdk = sdk
      },
      updateRevenueTier: (args: UpdateRevenueTierV1Args) => updateRevenueTierV1.call(this, args),
      updateErc20Distribution: (args: UpdateErc20DistributionArgs) => updateErc20Distribution.call(this, args),
      updateFinalFund: (args: UpdateFinalFundArgs) => updateFinalFund.call(this, args),
      addRevenueTier: (args: AddRevenueTierV1Args) => addRevenueTierV1.call(this, args),
    }
  }
}
