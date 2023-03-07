import { useContext } from "react"
import {
  useQuery,
  UseQueryOptions
} from '@tanstack/react-query'

import { AddressInput, R3vlContext } from ".."

type QueryResult = any

export const useTransactionEvents = (revPathAddress: AddressInput, queryOpts?: Omit<UseQueryOptions<QueryResult | null>, 'queryKey' | 'queryFn' | 'initialData'>) => {
  const ctx = useContext(R3vlContext)
  const client = ctx?.[revPathAddress]
  const chainId = ctx?.currentChainId
  const currentSignerAddress = ctx?.currentSignerAddress

  const query = useQuery(['/revPathTransactionEvents', revPathAddress, currentSignerAddress,  chainId], async () => {
    const events = await client?.transactionEvents?.()

    return events
  }, queryOpts)

  return query
}
