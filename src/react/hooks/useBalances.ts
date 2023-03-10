import { useContext } from "react"
import {
  useQuery,
  UseQueryOptions
} from '@tanstack/react-query'

import { AddressInput, R3vlContext } from ".."
import { tokenList } from "../../constants/tokens"

type QueryResult = {
  type: string
  withdrawn: number | false | undefined
  withdrawable: number | false | undefined
  earnings: number
}

export const useBalances = (revPathAddress: AddressInput, filter: {
  walletAddress?: string,
  isERC20?: keyof typeof tokenList
  blockNumber?: number
} | undefined = undefined, queryOpts?: Omit<UseQueryOptions<any | null>, 'queryKey' | 'queryFn' | 'initialData'>) => {
  const ctx = useContext(R3vlContext)
  const client = ctx?.[revPathAddress]

  const query = useQuery([
    '/balances',
    revPathAddress,
    filter?.walletAddress,
    filter?.isERC20,
    filter?.blockNumber,
    client,
  ], async () => {
    if (!client) throw new Error("No client found.")

    const earnings = client?.withdrawable ? await client?.withdrawable(filter) || 0 : 0 // TODO: Rename to received
    const withdrawn = await client?.withdrawn(filter) || 0
    const withdrawable = earnings - withdrawn < 0.0001 ? 0 : earnings - withdrawn

    return {
      withdrawn,
      withdrawable,
      pendingDistribution: 0,
      earnings,
    }
  }, {
    ...queryOpts,
    retryDelay: 400,
  } as any)

  return query
}
