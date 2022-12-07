import { useContext } from "react"
import {
  useQuery
} from '@tanstack/react-query'

import { R3vlContext } from ".."

const useEvents = <T>() => {
  const { client } = useContext(R3vlContext)
  const query = useQuery(['/events'], async () => {
    const result = await client.withdrawEvents()

    return result as T[]
  })

  return query
}

export default useEvents
