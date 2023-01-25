import React, { createContext, useState, useMemo, useEffect } from 'react'
import { QueryClient, QueryClientProvider, UseQueryOptions } from '@tanstack/react-query'

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
    setClient({ ...clients, [objKey || 'default']: revPath })
    
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
