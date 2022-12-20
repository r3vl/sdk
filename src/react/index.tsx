import React, { useContext, useEffect, createContext, useState, useMemo } from 'react'

import { R3vlClient, RevenuePath } from "../client"

type R3vlContextType = {
  client: RevenuePath | undefined
  initClient: (client: RevenuePath) => void
}

export const R3vlContext = createContext<R3vlContextType | undefined>(undefined)

interface Props {
  children: React.ReactNode
}

export const R3vlProvider: React.FC<Props> = ({ children }: {
  children: React.ReactNode
}) => {
  const [client, setClient] = useState<RevenuePath | undefined>()

  const initClient = (revPath: RevenuePath) => {
    setClient(revPath)
  }

  const contextValue = useMemo(
    () => ({ client, initClient }),
    [client],
  )

  return (
    <R3vlContext.Provider
      value={contextValue}
    >
      {children}
    </R3vlContext.Provider>
  )
}


export const useR3vlClient = (config: any) => {
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
