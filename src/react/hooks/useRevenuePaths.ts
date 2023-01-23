import { useContext } from "react"
import {
  QueryOptions,
  useQuery
} from '@tanstack/react-query'

import { R3vlContext } from ".."
import { RevenuePathsList } from "../../client"

export const useRevenuePaths = (queryOpts?: QueryOptions<RevenuePathsList>) => {
  const ctx = useContext(R3vlContext)
  const chainId = ctx?.chain
  const client = ctx?.default

  const query = useQuery(['/revenuePaths', chainId], async () => {
    const result = await client?.revenuePaths()

    return result
  }, {
    ...queryOpts,
    enabled: !!client?.v
  })

  return query
}
