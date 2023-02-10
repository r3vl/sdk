import { useContext, useEffect, useState } from "react"
import { R3vlClient, RevenuePath } from "../../client"
import { ClientConfig } from "../../types"
import { R3vlContext } from "../../react"

export const useR3vlClient = (config: ClientConfig & {
  initV0?: boolean
  initV1?: boolean
  initV2?: boolean
}) => {
  const context = useContext(R3vlContext)
  const [currentClient, setCurrentClient] = useState<RevenuePath | null>(null)

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
    const initialize = async () => {
      const clientInit = new R3vlClient({
        chainId,
        provider,
        signer,
        revPathAddress,
        includeEnsNames,
        ensProvider
      })

      const revPath = await clientInit.init({
        ...config
      })

      setCurrentClient(revPath)

      const { initClient, resetClient, currentChainId } = context

      if (currentChainId && currentChainId !== chainId) {
        resetClient()

        setTimeout(() => initClient(revPathAddress, revPath, chainId), 200)

        return
      }

      initClient(revPathAddress, revPath, chainId)
    }

    if (chainId && provider && signer) initialize()
  }, [
    revPathAddress,
    chainId,
    provider,
    signer,
    includeEnsNames,
    ensProvider
  ])

  return currentClient 
}
