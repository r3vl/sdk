import { useContext } from "react"
import {
  QueryOptions,
  useMutation
} from '@tanstack/react-query'
import { R3vlContext } from ".."


export const useCreateRevenuePath = <T>(queryOpts?: QueryOptions, { gasLimit }: { gasLimit: number } = { gasLimit: 900000 }) => {
  const ctx = useContext(R3vlContext)

  const mutation = useMutation(
    ['/createRevenuePath'],
    async (args: T) => {
      const client = ctx?.client && ctx?.client.default

      if (!client?.createRevenuePath) throw new Error("Couldn't find createRevenuePath")

      return await client.createRevenuePath(args, { gasLimit })
    },
    queryOpts
  )

  return mutation
}
