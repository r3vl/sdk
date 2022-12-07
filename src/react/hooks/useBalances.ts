import { useContext } from "react"
import {
  useQuery
} from '@tanstack/react-query'

import { R3vlContext } from ".."
import { tokenList } from "../../constants/tokens"


const useBalances = ({ walletAddress, isERC20 }: {
  walletAddress: string,
  isERC20?: keyof typeof tokenList
}) => {
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
  })

  return query
}

export default useBalances
