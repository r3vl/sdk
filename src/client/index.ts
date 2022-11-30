
import Base from "./base"

import { withdrawableV0, FnArgs as WithdrawableV0Args } from '../withdrawableV0'
// import { withdrawableV1 } from '../withdrawableV1'

import type { SplitsClientConfig } from '../types'
import { PathLibraryV0 } from '../typechain'
import { MainnetSdk, GoerliSdk } from "@dethcrypto/eth-sdk-client"

export class R3vlClient extends Base {
  revPathV0: PathLibraryV0 | undefined
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
      withdrawable: (args: WithdrawableV0Args) => withdrawableV0.call(this, args)
    }
  }

  get v1() {
    return {
      // withdrawable: () => withdrawableV1.call(this)
    }
  }
}
