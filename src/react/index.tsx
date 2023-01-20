import React, { createContext, useState, useMemo, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { R3vlClient, RevenuePath } from "../client"
import { ClientConfig } from '../types'

export type ClientType = { [address: string]: RevenuePath | undefined } | undefined

type R3vlContextType = {
  client: ClientType
  initClient: (objKey: string | undefined, revPath: RevenuePath | undefined) => void
}

const queryClient = new QueryClient()

export const createClient = () => {
  return {
    queryClient
  }
}

export const R3vlContext = createContext<R3vlContextType | undefined>(undefined)

interface Props {
  config?: ClientConfig & {
    initV0?: boolean
    initV1?: boolean
    initV2?: boolean
  }
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

  const initClient = (objKey: string | undefined, revPath: RevenuePath | undefined) => {
    setClient({ ...client, [objKey || 'default']: revPath })
  }

  useEffect(() => {
    if (config) {
      const initialize = async () => {
        const clientInit = new R3vlClient({
          chainId: config.chainId,
          provider: config.provider,
          signer: config.signer,
          revPathAddress: config.revPathAddress,
          includeEnsNames: config.includeEnsNames,
          ensProvider: config.ensProvider
        })
  
        const revPath = await clientInit.init({
          ...config
        })
  
        initClient(undefined, revPath)
      }

      initialize()
    }
  }, [config])

  return (
    <R3vlContext.Provider
      value={{ client, initClient }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </R3vlContext.Provider>
  )
}
