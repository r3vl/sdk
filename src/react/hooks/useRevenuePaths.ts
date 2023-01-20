import { useContext } from "react"
import {
  QueryOptions,
  useQuery
} from '@tanstack/react-query'

import { R3vlContext } from ".."
import { RevenuePathsList } from "../../client"

export const useRevenuePaths = (queryOpts?: QueryOptions<RevenuePathsList>) => {
  const ctx = useContext(R3vlContext)
  const client = ctx?.client && ctx?.client.default

  const query = useQuery(['/revenuePaths', client], async () => {
    if (!client) return null

    try {
      const result = await client?.revenuePaths()

      return result
    } catch (error) {
      console.log("Error::", error)

      return null
    }
  }, queryOpts)

  return query
}
