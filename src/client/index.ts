
import Base from "./base"

import type { SplitsClientConfig } from '../types'

export class R3vlClient extends Base {
  constructor({
    chainId,
    provider,
    signer,
    includeEnsNames = false,
    ensProvider,
  }: SplitsClientConfig) {
    super({
      chainId,
      provider,
      ensProvider,
      signer,
      includeEnsNames,
    })
  }
}
