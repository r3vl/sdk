import { useCallback, useContext, useState } from "react"

import { AddressInput, R3vlContext } from ".."
import { tokenList } from "../../constants/tokens"
import { ContractTransaction } from 'ethers'


export const useWithdraw = (revPathAddress: AddressInput, opts?: { isGasLess?: boolean }) => {
  const [isFetched, setIsFetched] = useState(false)
  const [error, setError] = useState<unknown>()
  const [isLoading, setIsLoading] = useState(false)

  const ctx = useContext(R3vlContext)
  const client = ctx?.[revPathAddress]
  const gasLessKey = ctx?.gasLessKey

  const mutate = useCallback(async ({
    walletAddress,
    isERC20,
    onTxCreated,
  }: {
    walletAddress: any,
    isERC20?: keyof typeof tokenList
    onTxCreated?: (tx: ContractTransaction) => void
  }) => {
    setIsLoading(true)
    
    try {
      if (!client?.withdraw) throw new Error("ERROR:: Couldn't find createRevenuePath")

      const payloadV1 = isERC20 ? { walletAddress, isERC20 } : { walletAddress }
      const payloadV2 = onTxCreated ? { ...payloadV1, onTxCreated } : payloadV1 
      
      await client?.withdraw(payloadV2, { ...opts, gasLessKey })
    } catch (_error) {
      setError(_error)
    } finally {
      setIsLoading(false)

      setIsFetched(true)
    }
  }, [revPathAddress, client])

  const mutateAsync = async ({
    walletAddress,
    isERC20,
    onTxCreated,
  }: {
    walletAddress: string,
    isERC20?: keyof typeof tokenList
    onTxCreated?: (tx: ContractTransaction) => void
  }) => {
    setIsLoading(true)
    
    try {
      if (!client?.withdraw) throw new Error("ERROR:: Couldn't find createRevenuePath")

      const payloadV1 = isERC20 ? { walletAddress, isERC20 } : { walletAddress }
      const payloadV2 = onTxCreated ? { ...payloadV1, onTxCreated } : payloadV1 
      
      await client?.withdraw(payloadV2, { ...opts, gasLessKey })
    } catch (_error) {
      setError(_error)
    } finally {
      setIsLoading(false)

      setIsFetched(true)
    }
  }

  return {
    mutate,
    mutateAsync,
    isFetched,
    isLoading,
    error
  }
}

export const useWithdrawGasLess = (revPathAddress: AddressInput) => {
  const [isFetched, setIsFetched] = useState(false)
  const [error, setError] = useState<unknown>()
  const [isLoading, setIsLoading] = useState(false)

  const ctx = useContext(R3vlContext)
  const client = ctx?.[revPathAddress]
  const gasLessKey = ctx?.gasLessKey || ""

  const mutate = useCallback(async ({
    walletAddress,
    isERC20,
  }: {
    walletAddress: string,
    isERC20?: keyof typeof tokenList
  }) => {
    setIsLoading(true)

    try {
      if (!client?.withdrawGasLess) throw new Error("ERROR:: Couldn't find createRevenuePath")

      const payloadV1 = isERC20 ? { walletAddress, isERC20 } : { walletAddress }

      await client?.withdrawGasLess(payloadV1, { gasLessKey })
    } catch (_error) {
      setError(_error)
    } finally {
      setIsLoading(false)

      setIsFetched(true)
    }
  }, [revPathAddress, client])

  const mutateAsync = async ({
    walletAddress,
    isERC20,
  }: {
    walletAddress: string,
    isERC20?: keyof typeof tokenList
  }) => {
    setIsLoading(true)

    try {
      if (!client?.withdrawGasLess) throw new Error("ERROR:: Couldn't find createRevenuePath")

      const payloadV1 = isERC20 ? { walletAddress, isERC20 } : { walletAddress }

      await client?.withdrawGasLess(payloadV1, { gasLessKey })
    } catch (_error) {
      setError(_error)
    } finally {
      setIsLoading(false)

      setIsFetched(true)
    }
  }

  return {
    mutate,
    mutateAsync,
    isFetched,
    isLoading,
    error
  }
}
