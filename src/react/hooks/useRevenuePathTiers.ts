import { useContext } from "react"
import {
  useQuery,
  UseQueryOptions
} from '@tanstack/react-query'

import { AddressInput, R3vlContext } from ".."

type QueryResult = any

export const useRevenuePathTiers = (revPathAddress: AddressInput, queryOpts?: Omit<UseQueryOptions<QueryResult | null>, 'queryKey' | 'queryFn' | 'initialData'>) => {
  const ctx = useContext(R3vlContext)
  const client = ctx?.[revPathAddress]

  const query = useQuery(['/useRevenuePathTiers', revPathAddress, client], async () => {
    if (!client || !client.tiers) throw new Error("No client found.")

    const tiers = await client?.tiers()

    return tiers
  }, queryOpts)

  return query
}
