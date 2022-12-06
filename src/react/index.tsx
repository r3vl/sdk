import React, { useEffect } from 'react'
import { createContext, useState } from 'react'

import type { RevenuePath } from "../client"

export const R3vlContext = createContext({})

export const R3vlProvider = ({ children, client: _client }: {
  children: React.ReactNode
  client: RevenuePath
}) => {
  const [client] = useState<RevenuePath | null>()

  useEffect(() => {
    if (!_client) return
  }, [])

  if (!client) return null

  return (
    <R3vlContext.Provider
      value={{
        _client,
      }}
    >
      {children}
    </R3vlContext.Provider>
  )
}
