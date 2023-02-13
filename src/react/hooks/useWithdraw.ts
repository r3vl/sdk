import { useContext } from "react"
import {
  QueryOptions,
  useMutation
} from '@tanstack/react-query'

import { AddressInput, R3vlContext } from ".."
import { tokenList } from "../../constants/tokens"
import { ContractTransaction } from 'ethers'


export const useWithdraw = (revPathAddress: AddressInput, queryOpts?: QueryOptions) => {
  const ctx = useContext(R3vlContext)

  if (!ctx) return null

  const client = ctx?.[revPathAddress]

  const mutation = useMutation(['/withdraw', revPathAddress], async ({
    walletAddress,
    isERC20,
    onTxCreated
  }: {
    walletAddress: string,
    isERC20?: keyof typeof tokenList
    onTxCreated?: (tx: ContractTransaction) => void
  }) => {
    const payloadV1 = isERC20 ? { walletAddress, isERC20 } : { walletAddress }
    const payloadV2 = client?.v == 2 ? { ...payloadV1, onTxCreated }  : payloadV1;

    return await client?.withdraw(payloadV2)
  }, queryOpts)

  return mutation
}
