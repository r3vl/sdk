import { useContext } from "react"
import {
  useQuery,
  QueryOptions
} from '@tanstack/react-query'

import { R3vlContext } from ".."
import { tokenList } from "../../constants/tokens"

type QueryResult = {
  withdrawn: number | false | undefined
  withdrawable: number | false | undefined
  earnings: number
}

export const useBalances = ({ walletAddress, ERC20Address }: {
  walletAddress: string,
  ERC20Address?: keyof typeof tokenList
}, queryOpts?: QueryOptions<QueryResult>) => {
  const { client } = useContext(R3vlContext)
  const query = useQuery(['/balances', walletAddress, ERC20Address], async () => {
    const payload = ERC20Address ? { walletAddress, ERC20Address } : { walletAddress }
    const withdrawn = await client.withdrawn(payload)
    const withdrawable = await client.withdrawable(payload)
    const earnings = withdrawn && withdrawable ? withdrawn + withdrawable : 0

    return {
      withdrawn,
      withdrawable,
      earnings
    }
  }, queryOpts)

  return query
}
