import { useContext } from "react"
import {
  QueryOptions,
  useQuery
} from '@tanstack/react-query'

import { R3vlContext } from ".."

export const useEvents = <T>(queryOpts?: QueryOptions<T[]>) => {
  const ctx = useContext(R3vlContext)

  if (!ctx ) return null

  const { client } = ctx

  const query = useQuery(['/events'], async () => {
    const result = await client?.withdrawEvents()

    return result as T[]
  }, queryOpts)

  return query
}
