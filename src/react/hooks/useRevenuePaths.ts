import { useContext } from "react"
import {
  QueryOptions,
  useQuery
} from '@tanstack/react-query'

import { R3vlContext } from ".."
import { RevenuePathsList } from "../../client"

export const useRevenuePaths = (queryOpts?: QueryOptions<RevenuePathsList>) => {
  const ctx = useContext(R3vlContext)

  if (!ctx) return null

  const { client } = ctx

  const query = useQuery(['/revenuePaths', client], async () => {
    const result = await client?.revenuePaths()

    return result
  }, queryOpts)

  return query
}
