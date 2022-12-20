import { useContext } from "react"
import {
  QueryOptions,
  useMutation
} from '@tanstack/react-query'
import { R3vlContext } from ".."


export const useCreateRevenuePath = <T>(queryOpts?: QueryOptions) => {
  const { client } = useContext(R3vlContext)

  return useMutation(
    ['/createRevenuePath'],
    async (args: T) => {
      if (!client.createRevenuePath) return

      return await client.createRevenuePath(args)
    },
    queryOpts
  )
}
