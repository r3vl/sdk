import { useContext, useEffect } from "react"
import { R3vlClient } from "../../client"
import { ClientConfig } from "../../types"
import { R3vlContext } from "../../react"

export const useR3vlClient = (config: ClientConfig) => {
  const context = useContext(R3vlContext)

  if (context === undefined) {
    throw new Error('Make sure to include <R3vlProvider>')
  }

  const { client, initClient } = context

  const chainId = config.chainId
  const provider = config.provider
  const signer = config.signer
  const revPathAddress = config.revPathAddress
  const includeEnsNames = config.includeEnsNames
  const ensProvider = config.ensProvider

  useEffect(() => {
    const initialize = async () => {
      const client = new R3vlClient({
        chainId,
        provider,
        signer,
        revPathAddress,
      })
  
      const revPath = await client.init()

      if (!revPath) throw new Error("Could not initialize Revenue Path")

      initClient(revPath)
    }

    initialize()
  }, [chainId, provider, signer, includeEnsNames, ensProvider])

  return client
}
