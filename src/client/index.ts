
import Base from "./base"

import { withdrawableV0, FnArgs as WithdrawableV0Args } from '../withdrawableV0'
import { withdrawnV0, FnArgs as WithdrawnV0Args } from '../withdrawnV0'
import { withdrawableV1, FnArgs as WithdrawableV1Args } from '../withdrawableV1'
import { withdrawnV1, FnArgs as WithdrawnV1Args } from '../withdrawnV1'

import type { SplitsClientConfig } from '../types'
import { PathLibraryV0, PathLibraryV1 } from '../typechain'
import { MainnetSdk, GoerliSdk } from "@dethcrypto/eth-sdk-client"

export class R3vlClient extends Base {
  revPathV0: PathLibraryV0 | undefined
  revPathV1: PathLibraryV1 | undefined
  sdk: MainnetSdk | GoerliSdk | undefined

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
      withdrawn: (args: WithdrawnV0Args) => withdrawnV0.call(this, args)
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
      withdrawn: (args: WithdrawnV1Args) => withdrawnV1.call(this, args)
    }
  }
}
