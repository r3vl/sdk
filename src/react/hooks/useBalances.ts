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
  const chainId = ctx?.currentChainId

  const query = useQuery([
    '/balances',
    revPathAddress,
    filter?.walletAddress,
    filter?.isERC20,
    filter?.blockNumber,
    ctx?.contextHash,
    chainId
  ], async () => {
    if (!client) throw new Error("No client found.")

    const withdrawn = await client?.withdrawn(filter) || 0
    const [pendingDistribution, withdrawable] = client?.withdrawable ? await client?.withdrawable(filter) || [0, 0]  : [0, 0]
    const earnings = withdrawable + pendingDistribution + withdrawn

    return {
      withdrawn: withdrawn, // TODO: replace with parseUInits
      withdrawable: withdrawable, // TODO: replace with parseUInits
      pendingDistribution: pendingDistribution, // TODO: replace with parseUInits
      earnings: earnings, // TODO: replace with parseUInits
    }
  }, queryOpts)

  return query
}
