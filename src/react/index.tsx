import React, { useMemo } from 'react'
import { createContext, useState } from 'react'

import type { RevenuePath } from "../client"

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
