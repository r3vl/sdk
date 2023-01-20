import { useContext } from "react"
import {
  useQuery,
  UseQueryOptions
} from '@tanstack/react-query'

import { R3vlContext } from ".."
import { tokenList } from "../../constants/tokens"

type QueryResult = {
  withdrawn: number | false | undefined
  withdrawable: number | false | undefined
  earnings: number
}

export const useBalances = (revPathAddress: string, filter: {
  walletAddress?: string,
  ERC20Address?: keyof typeof tokenList
} | undefined = undefined, queryOpts?: Omit<UseQueryOptions<QueryResult | null>, 'queryKey' | 'queryFn' | 'initialData'>) => {
  const ctx = useContext(R3vlContext)
  const client = ctx?.client && ctx?.client[revPathAddress]

  const query = useQuery(['/balances', revPathAddress, filter?.walletAddress, filter?.ERC20Address, client], async () => {
    if (!client) return null

    const withdrawn = await client?.withdrawn(filter)
    const withdrawable = await client?.withdrawable(filter)
    const earnings = withdrawn && withdrawable ? withdrawn + withdrawable : 0

    return {
      withdrawn,
      withdrawable,
      earnings
    }
  }, queryOpts)

  return query
}
