import { useContext, useEffect } from "react"
import { R3vlClient } from "../../client"
import { ClientConfig } from "../../types"
import { R3vlContext } from "../../react"

export const useR3vlClient = (config: ClientConfig & {
  initV0?: boolean
  initV1?: boolean
  initV2?: boolean
  initV2Final?: boolean
  initSimple?: boolean
  customDefaultKey?: string
  revPathMetadata?: { walletList: [[string]]; distribution: [[number]], tiers: {[t: string]: number}[] }
  apiKey?: string
}) => {
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
  const gasLessKey = config.gasLessKey

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
        ...config,
        revPathMetadata: config?.revPathMetadata,
        apiKey: config?.apiKey
      })

      const signerAddress = await signer?.getAddress()

      const { initClient, resetClient, currentChainId, currentSignerAddress, gasLessKey: currentGaslessKey } = context

      if (
        (currentChainId && currentChainId !== chainId) ||
        (currentSignerAddress && currentSignerAddress !== signerAddress)
      ) {
        resetClient()

        setTimeout(() => initClient(
          revPathAddress,
          revPath,
          chainId,
          config.customDefaultKey,
          signerAddress,
          currentGaslessKey || gasLessKey
        ), 200)

        return;
      }

      initClient(
        revPathAddress,
        revPath,
        chainId,
        config.customDefaultKey,
        signerAddress,
        currentGaslessKey || gasLessKey
      )
    }

    if (chainId && provider) initialize()
  }, [
    revPathAddress,
    chainId,
    provider,
    signer,
    includeEnsNames,
    ensProvider,
    gasLessKey
  ])

  return context
}
