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
  const chainId = ctx?.currentChainId

  const query = useQuery(['/useRevenuePathTiers', revPathAddress, ctx?.contextHash, chainId], async () => {
    if (!client || !client.tiers) return null

    const tiers = await client?.tiers()

    return tiers
  }, queryOpts)

  return query
}
