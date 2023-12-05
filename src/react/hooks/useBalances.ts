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
    const earnings = client?.withdrawable ? await client?.withdrawable(filter) || 0 : 0 // TODO: Rename to received
    const _withdrawn = await client?.withdrawn?.(filter) || 0
    const withdrawn = _withdrawn > earnings ? earnings : _withdrawn === -1 ? 0 : _withdrawn
    const withdrawable = _withdrawn === -1 ? 0 : earnings - withdrawn

    return {
      withdrawn,
      withdrawable,
      pendingDistribution: 0,
      earnings,
    }
  }, {
    ...queryOpts,
    enabled: typeof queryOpts?.enabled !== "undefined" ? queryOpts.enabled && !!client : !!client,
    retryDelay: 400,
  } as any)

  return query
}
