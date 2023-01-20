import { useContext } from "react"
import {
  QueryOptions,
  useMutation
} from '@tanstack/react-query'
import { R3vlContext } from ".."
import { UpdateRevenueTierV1Args } from "../../updateRevenueTierV1"
import { UpdateErc20DistributionArgs } from "../../updateErc20Distribution"
import { UpdateFinalFundArgs } from "../../updateFinalFund"
import { AddRevenueTierV1Args } from "../../addRevenueTierV1"
import { FnArgs as UpdateRevenueTiersV2Args } from "../../updateRevenueTiersV2"
import { FnArgs as UpdateLimitsV2Args } from "../../updateLimitsV2"
import { FnArgs as AddRevenueTiersV2Args } from "../../addRevenueTiersV2"


export const useUpdateRevenuePath = (queryOpts?: QueryOptions) => {
  const ctx = useContext(R3vlContext)

  return {
    updateRevenueTier: useMutation(
      ['/updateRevenueTier', ctx?.client],
      async (args: UpdateRevenueTierV1Args) => {
        const client = ctx?.client && ctx?.client.default

        if (!client?.updateRevenueTier) return

        return await client.updateRevenueTier(args)
      },
      queryOpts
    ),
    updateErc20Distribution: useMutation(
      ['/updateErc20Distribution', ctx?.client],
      async (args: UpdateErc20DistributionArgs) => {
        const client = ctx?.client && ctx?.client.default

        if (!client?.updateErc20Distribution) return

        return await client.updateErc20Distribution(args)
      },
      queryOpts
    ),
    updateFinalFund: useMutation(
      ['/updateFinalFund', ctx?.client],
      async (args: UpdateFinalFundArgs) => {
        const client = ctx?.client && ctx?.client.default

        if (!client?.updateFinalFund) return

        return await client.updateFinalFund(args)
      },
      queryOpts
    ),
    addRevenueTier: useMutation(
      ['/addRevenueTier', ctx?.client],
      async (args: AddRevenueTierV1Args) => {
        const client = ctx?.client && ctx?.client.default

        if (!client?.addRevenueTier) return

        return await client.addRevenueTier(args)
      },
      queryOpts
    ),
    addRevenueTiers: useMutation(
      ['/addRevenueTiers', ctx?.client],
      async (args: AddRevenueTiersV2Args) => {
        const client = ctx?.client && ctx?.client.default

        if (!client?.addRevenueTiers) return

        return await client.addRevenueTiers(args)
      },
      queryOpts
    ),
    updateRevenueTiers: useMutation(
      ['/updateRevenueTiers', ctx?.client],
      async (args: UpdateRevenueTiersV2Args) => {
        const client = ctx?.client && ctx?.client.default

        if (!client?.updateRevenueTiers) return

        return await client.updateRevenueTiers(args)
      },
      queryOpts
    ),
    updateLimits: useMutation(
      ['/updateLimits', ctx?.client],
      async (args: UpdateLimitsV2Args) => {
        const client = ctx?.client && ctx?.client.default

        if (!client?.updateLimits) return

        return await client.updateLimits(args)
      },
      queryOpts
    )
  }
}
