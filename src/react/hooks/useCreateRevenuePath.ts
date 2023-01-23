import { useCallback, useContext, useState } from "react"
import { R3vlContext } from ".."
import { FnArgs as CreateRevenuePathV1Args } from "../../createRevenuePathV1"
import { FnArgs as CreateRevenuePathV2Args } from "../../createRevenuePathV2"
import { ContractReceipt } from "ethers"

export const useCreateRevenuePath = ({ gasLimit }: { gasLimit: number } = { gasLimit: 900000 }) => {
  const ctx = useContext(R3vlContext)
  const client = ctx?.default
  const [data, setData] = useState<ContractReceipt | undefined>()
  const [isFetched, setIsFetched] = useState(false)
  const [error, setError] = useState<unknown>()
  const [loading, setLoading] = useState(false)

  const mutate = useCallback(async (args: CreateRevenuePathV1Args | CreateRevenuePathV2Args) => {
    setLoading(true)

    try {
      if (!client?.createRevenuePath) throw new Error("ERROR:: Couldn't find createRevenuePath")

      const response = await client?.createRevenuePath?.(args, { gasLimit })

      setData(response)
    } catch (_error) {
      setError(_error)
    } finally {
      setLoading(false)

      setIsFetched(true)
    }
  }, [client])

  const mutateAsync = async (args: CreateRevenuePathV1Args | CreateRevenuePathV2Args) => {    
    if (!client?.createRevenuePath) throw new Error("ERROR:: Couldn't find createRevenuePath")

    const response = await client?.createRevenuePath?.(args, { gasLimit })

    return response   
  }

  return {
    data,
    error,
    loading,
    isFetched,
    mutate,
    mutateAsync,
    reset: () => {
      setData(undefined)
      setError(undefined)
      setIsFetched(false)
    }
  }
}
