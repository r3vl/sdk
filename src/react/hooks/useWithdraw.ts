import { useContext } from "react"
import {
  QueryOptions,
  useMutation
} from '@tanstack/react-query'

import { R3vlContext } from ".."
import { tokenList } from "../../constants/tokens"


export const useWithdraw = (queryOpts?: QueryOptions) => {
  const ctx = useContext(R3vlContext)

  if (!ctx ) return null

  const { client } = ctx

  const mutation = useMutation(['/withdraw'], async ({
    walletAddress,
    ERC20Address
  }: {
    walletAddress: string,
    ERC20Address?: keyof typeof tokenList
  }) => {
    const payload = ERC20Address ? { walletAddress, ERC20Address } : { walletAddress }

    return await client?.withdraw(payload)
  }, queryOpts)

  return mutation
}
