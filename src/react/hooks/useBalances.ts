import { useContext } from "react"
import {
  useQuery,
  UseQueryOptions
} from '@tanstack/react-query'

import { AddressInput, R3vlContext } from ".."
import { tokenList } from "../../constants/tokens"

type QueryResult = {
  withdrawn: number | false | undefined
  withdrawable: number | false | undefined
  earnings: number
}

export const useBalances = (revPathAddress: AddressInput, filter: {
  walletAddress?: string,
  isERC20?: keyof typeof tokenList
} | undefined = undefined, queryOpts?: Omit<UseQueryOptions<QueryResult | null>, 'queryKey' | 'queryFn' | 'initialData'>) => {
  const ctx = useContext(R3vlContext)
  const chainId = ctx?.chain?.id
  const client = ctx?.[revPathAddress]

  const query = useQuery(['/balances', chainId, revPathAddress, filter?.walletAddress, filter?.isERC20, client], async () => {
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
