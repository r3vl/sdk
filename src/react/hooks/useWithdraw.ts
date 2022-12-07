import { useContext } from "react"
import {
  useMutation
} from '@tanstack/react-query'

import { R3vlContext } from ".."
import { tokenList } from "../../constants/tokens"


const useWithdraw = () => {
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
  })

  return {
    ...mutation,
    withdraw: mutation.mutate
  }
}

export default useWithdraw
