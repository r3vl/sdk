import React, { createContext, useState, useMemo, useEffect } from 'react'
import { QueryClient, QueryClientProvider, UseQueryOptions } from '@tanstack/react-query'

import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import { compress, decompress } from 'lz-string'

import { R3vlClient, RevenuePath } from "../client"
import { ClientConfig } from '../types'

export type UserQueryOPTs = Omit<UseQueryOptions<any, any, any, any>, 'queryKey' | 'queryFn' | 'initialData'> & { logContext?: boolean }

export type AddressInput = `0x${string}`

export type ClientType = {
  default?: RevenuePath
  [address: AddressInput]: RevenuePath | undefined
}

type R3vlContextType = ClientType & {
  contextHash?: string
  currentChainId?: number
  initClient: (objKey: string | undefined, revPath: RevenuePath, currentChainId: number) => void
  resetClient: () => void
}

const queryClient = new QueryClient()

persistQueryClient({
  queryClient,
  persister: createSyncStoragePersister({
    storage: typeof window === "undefined" ? undefined : window.localStorage,
    serialize: data => compress(JSON.stringify(data)),
    deserialize: data => JSON.parse(decompress(data) || ''),
  }),
})

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
  children,
  client: _client
}: Props) => {
  const [clients, setClient] = useState<ClientType>({})
  const [currentChainId, setCurrentChainId] = useState<number | undefined>()
  const { queryClient } = _client
  const contextHash = Object.keys(clients).reduce((prev, curr: any) => {
    return prev + `[${curr}-${currentChainId}]`
  }, '')

  const initClient = (objKey: string | undefined, revPath: RevenuePath, _currentChainId: number) => {
    setClient((clients) => ({ ...clients, [objKey || 'default']: revPath }))
    
    setCurrentChainId(_currentChainId)
  }

  const resetClient = () => {
    setClient({})
    
    setCurrentChainId(undefined)
  }

  const contextMemo = useMemo(
    () => ({ ...clients, contextHash, currentChainId, initClient, resetClient }),
    [contextHash]
  )

  return (
    <R3vlContext.Provider
      value={contextMemo}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </R3vlContext.Provider>
  )
}
