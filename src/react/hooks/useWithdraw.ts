import { useContext } from "react"
import {
  QueryOptions,
  useMutation
} from '@tanstack/react-query'

import { AddressInput, R3vlContext } from ".."
import { tokenList } from "../../constants/tokens"


export const useWithdraw = (revPathAddress: AddressInput, queryOpts?: QueryOptions) => {
  const ctx = useContext(R3vlContext)

  if (!ctx ) return null

  const client = ctx?.[revPathAddress]

  const mutation = useMutation(['/withdraw', revPathAddress], async ({
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
