import { useContext, useEffect } from "react"
import { R3vlClient } from "../../client"
import { SplitsClientConfig } from "../../types"
import { R3vlContext } from "../../react"

export const useR3vlClient = (config: SplitsClientConfig) => {
  const context = useContext(R3vlContext)
  if (context === undefined) {
    throw new Error('Make sure to include <R3vlProvider>')
  }

  const chainId = config.chainId
  const provider = config.provider
  const signer = config.signer
  const revPathAddress = config.revPathAddress
  const includeEnsNames = config.includeEnsNames
  const ensProvider = config.ensProvider
  useEffect(() => {
    const client = new R3vlClient({
      chainId,
      provider,
      signer,
      revPathAddress,
    })

    client.v1.init()
  }, [chainId, provider, signer, includeEnsNames, ensProvider])

  return context.client
}