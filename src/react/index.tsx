import React, { createContext, useState, useMemo } from 'react'
import { QueryClient, QueryClientProvider, UseQueryOptions } from '@tanstack/react-query'

import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import { compress, decompress } from 'lz-string'

import { RevenuePath } from "../client"
import { ClientConfig } from '../types'

export type UserQueryOPTs = Omit<UseQueryOptions<any, any, any, any>, 'queryKey' | 'queryFn' | 'initialData'> & { logContext?: boolean }

export type AddressInput = `0x${string}`

export type ClientType = {
  default?: RevenuePath
  [address: AddressInput]: RevenuePath | undefined
}

type R3vlContextType = ClientType & {
  gasLessKey?: string
  contextHash?: string
  currentChainId?: number
  currentSignerAddress?: string
  initClient: (
    objKey: string | undefined,
    revPath: RevenuePath,
    currentChainId: number,
    customDefaultKey?: string,
    currentSignerAddress?: string,
    gasLessKey?: string
  ) => void
  resetClient: () => void
}

const queryClient = new QueryClient()

 persistQueryClient({
  queryClient,
  persister: createSyncStoragePersister({
    storage: globalThis.localStorage,
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
    initV2Final?: boolean
    initSimple?: boolean
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
  const [gasLessKey, setGaslessKey] = useState<string | undefined>()
  const [currentChainId, setCurrentChainId] = useState<number | undefined>()
  const [currentSignerAddress, setCurrentSignerAddress] = useState<string | undefined>()
  const { queryClient } = _client
  const contextHash = Object.keys(clients).reduce((prev, curr: any) => {
    return prev + `[${curr}-${currentChainId}-${currentSignerAddress}]`
  }, '')

  const initClient = (
    objKey: string | undefined,
    revPath: RevenuePath,
    _currentChainId: number,
    customDefaultKey?: string,
    _currentSignerAddress?: string,
    _gasLessKey?: string,
  ) => {
    setClient((clients) => ({ ...clients, [objKey || customDefaultKey || 'default']: revPath }))

    setCurrentChainId(_currentChainId)
    setCurrentSignerAddress(_currentSignerAddress)
    setGaslessKey(_gasLessKey)
  }

  const resetClient = () => {
    setClient({})
    
    setCurrentChainId(undefined)
    setCurrentSignerAddress(undefined)
  }

  const contextMemo = useMemo(
    () => ({
      ...clients,
      contextHash,
      currentChainId,
      currentSignerAddress,
      initClient,
      resetClient,
      gasLessKey
    }),
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
