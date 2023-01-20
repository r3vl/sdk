import React, { createContext, useState, useMemo, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { R3vlClient, RevenuePath } from "../client"
import { ClientConfig } from '../types'

type ClientType = { [address: string]: RevenuePath } | undefined

type R3vlContextType = {
  client: ClientType
  initClient: (objKey: string, revPath: RevenuePath) => void
}

const queryClient = new QueryClient()

export const createClient = () => {
  return {
    queryClient
  }
}

export const R3vlContext = createContext<R3vlContextType | undefined>(undefined)

interface Props {
  config?: ClientConfig
  children: React.ReactNode
  client: {
    queryClient: QueryClient
  }
}

export const R3vlProvider: React.FC<Props> = ({
  config,
  children,
  client: _client
}: Props) => {
  const [client, setClient] = useState<ClientType>()
  const { queryClient } = _client

  const initClient = (objKey: string, revPath: RevenuePath) => {
    setClient({ ...client, [objKey]: revPath })
  }

  const contextValue = useMemo(
    () => ({ client, initClient }),
    [client],
  )

  useEffect(() => {
    if (config) {
      const initialize = async () => {
        const client = new R3vlClient({
          chainId: config.chainId,
          provider: config.provider,
          signer: config.signer,
          revPathAddress: config.revPathAddress,
          includeEnsNames: config.includeEnsNames,
          ensProvider: config.ensProvider
        })
  
        const revPath = await client.init()
  
        if (config.revPathAddress) initClient(config.revPathAddress, revPath)
        else initClient('default', revPath)
      }

      initialize()
    }
  }, [config])

  return (
    <R3vlContext.Provider
      value={contextValue}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </R3vlContext.Provider>
  )
}
