import { useContext } from "react"
import {
  QueryOptions,
  useQuery
} from '@tanstack/react-query'

import { R3vlContext } from ".."
import { RevenuePathsList } from "../../client"

export const useRevenuePaths = (wallet?: string, queryOpts?: QueryOptions<RevenuePathsList>) => {
  const ctx = useContext(R3vlContext)
  const chainId = ctx?.chain
  const client = ctx?.default

  const query = useQuery(['/revenuePaths', chainId], async () => {
    const result = await client?.revenuePaths()

    if (!wallet) return result as RevenuePathsList

    for (let i = 0; i < result.length; i++) {
      const { contract, address } = result[i]
      const totalTiers = await contract.getTotalRevenueTiers()
      const walletList: string[] = []

      for (let i = 0; i < totalTiers.toNumber(); i++) {
        const wallets = await contract.getRevenueTier(i)

        wallets.map((_wallet: string) => {
          if (!~walletList.indexOf(_wallet)) walletList.push(_wallet)
        })
      }

      result[i] = {
        ...result[i],
        isUserInPath: !!~walletList.indexOf(wallet),
      }
    }

    return result as RevenuePathsList
  }, {
    ...queryOpts,
    enabled: !!client?.v
  })

  return query
}
