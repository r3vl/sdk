import { useContext, useEffect } from "react"
import { R3vlClient } from "../../client"
import { ClientConfig } from "../../types"
import { R3vlContext } from "../../react"

export const useR3vlClient = (config: ClientConfig & {
  initV0?: boolean
  initV1?: boolean
  initV2?: boolean
}) => {
  const context = useContext(R3vlContext)

  if (context === undefined) {
    throw new Error('Make sure to include <R3vlProvider>')
  }

  const { client, initClient } = context

  const chainId = config.chainId
  const provider = config.provider
  const signer = config.signer
  const revPathAddress = config.revPathAddress || ''
  const includeEnsNames = config.includeEnsNames
  const ensProvider = config.ensProvider

  useEffect(() => {
    const initialize = async () => {
      const client = new R3vlClient({
        chainId,
        provider,
        signer,
        revPathAddress,
        includeEnsNames,
        ensProvider
      })

      const revPath = await client.init({
        ...config
      })

      if (revPathAddress !== '') initClient(revPathAddress, revPath)
      else initClient('default', revPath)
    }

    if (chainId && provider && signer) initialize()
  }, [!!chainId, !!provider, !!signer, !!includeEnsNames, !!ensProvider])

  return client
}
