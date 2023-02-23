import { useContext, useMemo } from "react"
import {
  useQueries,
  useQuery
} from '@tanstack/react-query'

import { R3vlContext, UserQueryOPTs } from ".."
import { RevenuePathsList } from "../../client"

const generateQueries = (revPaths?: RevenuePathsList, wallet?: string, chainId?: number, queryOpts?: any) => {
  if (!revPaths) return []

  return revPaths.map((revPath: any) => ({
    queryKey: ['/revPathBelongsToWallet', revPath.address, wallet, chainId],
    queryFn: async () => {
      const { contract } = revPath
      const walletList: string[] = []

      if (contract?.walletName && await contract?.walletName()) {
        let payeeFailed = false
        let payeeCount = 0

        while (!payeeFailed) {
          try {
            const p = await contract.payee(payeeCount)

            walletList.push(p)

            payeeCount++
          } catch {
            payeeFailed = true
          }
        }

        return {
          ...revPath,
          isUserInPath: !!~walletList.indexOf(wallet || ''),
          walletList
        }
      }


      const totalTiers = await contract.getTotalRevenueTiers()

      for (let i = 0; i < totalTiers.toNumber(); i++) {
        const tier = await contract.getRevenueTier(i)
        const wallets = tier?._walletList ? tier?._walletList : tier

        wallets.map((_wallet: string) => {
          if (!~walletList.indexOf(_wallet)) walletList.push(_wallet)
        })
      }

      return {
        ...revPath,
        isUserInPath: !!~walletList.indexOf(wallet || ''),
        walletList
      }
    },
    ...queryOpts
  })) 
}

export const useRevenuePaths = (wallet?: string | boolean, queryOpts?: UserQueryOPTs, hookConfig?: { customDefaultKey?: string }) => {
  const ctx: any = useContext(R3vlContext)
  const client = ctx?.[hookConfig?.customDefaultKey || 'default']
  const currentChainId = ctx?.currentChainId

  if (queryOpts?.logContext) console.log("R3VL SDK Context:::", ctx)

  const query = useQuery(['/revenuePaths' + hookConfig?.customDefaultKey ? `/${hookConfig?.customDefaultKey}` : '', wallet, currentChainId, hookConfig?.customDefaultKey], async () => {
    if (!client) return []

    const result = await client.revenuePaths()

    return result as RevenuePathsList
  }, {
    ...queryOpts
  })

  const queries = useMemo(() => {
    if (typeof wallet !== 'string' || !wallet?.length) return []

    return generateQueries(query.data, wallet, currentChainId, queryOpts)
  }, [
    query.data,
    wallet,
    currentChainId
  ])

  const results = useQueries({ queries })

  return {
    ...query,
    data: results.map(({ data }) => data),
    dataRaw: query.data,
    isLoading:
      query.isRefetching ||
      query.isLoading ||
      results.some(({ isLoading }) => isLoading),
    isFetched: query.isFetched && !results.some(({ isFetched: _isFetched }) => !_isFetched)
  }
}
