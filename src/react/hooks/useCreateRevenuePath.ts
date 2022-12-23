import { useContext } from "react"
import {
  QueryOptions,
  useMutation
} from '@tanstack/react-query'
import { R3vlContext } from ".."


export const useCreateRevenuePath = <T>(queryOpts?: QueryOptions) => {
  const ctx = useContext(R3vlContext)

  if (!ctx ) return null

  const { client } = ctx

  return useMutation(
    ['/createRevenuePath'],
    async (args: T) => {
      if (!client?.createRevenuePath) return

      return await client.createRevenuePath(args)
    },
    queryOpts
  )
}
