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

const useBalances = ({ walletAddress, isERC20 }: {
  walletAddress: string,
  isERC20?: keyof typeof tokenList
}, queryOpts?: QueryOptions<QueryResult>) => {
  const { client } = useContext(R3vlContext)
  const query = useQuery(['/balances', walletAddress, isERC20], async () => {
    const payload = isERC20 ? { walletAddress, isERC20 } : { walletAddress }
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

export default useBalances
