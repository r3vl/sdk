import { useContext } from "react"
import {
  QueryOptions,
  useQuery
} from '@tanstack/react-query'

import { R3vlContext } from ".."

export const useEvents = <T>(queryOpts?: QueryOptions<T[]>) => {
  const { client } = useContext(R3vlContext)
  const query = useQuery(['/events'], async () => {
    const result = await client.withdrawEvents()

    return result as T[]
  }, queryOpts)

  return query
}
