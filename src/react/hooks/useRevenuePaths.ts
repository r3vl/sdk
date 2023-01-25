import { useContext, useMemo } from "react"
import {
  useQueries,
  useQuery
} from '@tanstack/react-query'

import { R3vlContext, UserQueryOPTs } from ".."
import { RevenuePathsList } from "../../client"

const generateQueries = (revPaths?: RevenuePathsList, wallet?: string, chainId?: number) => {
  if (!revPaths) return []

  return revPaths.map((revPath: any) => ({
    queryKey: ['/revPathBelongsToWallet', revPath.address, wallet, chainId],
    queryFn: async () => {
      const { contract } = revPath
      const totalTiers = await contract.getTotalRevenueTiers()
      const walletList: string[] = []

      for (let i = 0; i < totalTiers.toNumber(); i++) {
        const wallets = await contract.getRevenueTier(i)

        wallets.map((_wallet: string) => {
          if (!~walletList.indexOf(_wallet)) walletList.push(_wallet)
        })
      }

      return {
        ...revPath,
        isUserInPath: !!~walletList.indexOf(wallet || ''),
      }
    },
  })) 
}

export const useRevenuePaths = (wallet?: string, queryOpts?: UserQueryOPTs) => {
  const ctx = useContext(R3vlContext)
  const client = ctx?.default
  const currentChainId = ctx?.currentChainId

  if (queryOpts?.logContext) console.log("R3VL SDK Context:::", ctx)

  const query = useQuery(['/revenuePaths', wallet, , currentChainId], async () => {
    if (!client) return []

    const result = await client.revenuePaths()

    return result as RevenuePathsList
  }, {
    ...queryOpts
  })

  const queries = useMemo(() => {
    return generateQueries(query.data, wallet, currentChainId)
  }, [
    query.data,
    wallet,
    currentChainId
  ])

  const results = useQueries({ queries })

  return {
    ...query,
    data: results.map(({ data }) => data),
    isLoading:
      query.isRefetching ||
      query.isLoading ||
      results.some(({ isLoading }) => isLoading),
    isFetched: !results.some(({ isFetched: _isFetched }) => !_isFetched)
  }
}
