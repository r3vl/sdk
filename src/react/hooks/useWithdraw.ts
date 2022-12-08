import { useContext } from "react"
import {
  QueryOptions,
  useMutation
} from '@tanstack/react-query'

import { R3vlContext } from ".."
import { tokenList } from "../../constants/tokens"


const useWithdraw = (queryOpts?: QueryOptions) => {
  const { client } = useContext(R3vlContext)
  const mutation = useMutation(['/withdraw'], async ({
    walletAddress,
    isERC20
  }: {
    walletAddress: string,
    isERC20?: keyof typeof tokenList
  }) => {
    const payload = isERC20 ? { walletAddress, isERC20 } : { walletAddress }

    return await client.withdraw(payload)
  }, queryOpts)

  return {
    ...mutation,
    withdraw: mutation.mutate
  }
}

export default useWithdraw
