import React, { useContext, useEffect } from 'react'
import { createContext, useState } from 'react'

import { R3vlClient, RevenuePath } from "../client"

export const R3vlContext = createContext({} as {
  client: RevenuePath
})

interface Props {
  client: RevenuePath
  children: React.ReactNode
}

export const R3vlProvider: React.FC<Props> = ({ children, client: _client }: {
  children: React.ReactNode
  client: RevenuePath
}) => {
  const [client, setClient] = useState<RevenuePath | null>()

  // useEffect(() => {
  //   if (!_client) return

  //   setClient(_client)
  // }, [])

  // if (!client) return null

  return (
    <R3vlContext.Provider
      value={{
        client: _client,
      }}
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
