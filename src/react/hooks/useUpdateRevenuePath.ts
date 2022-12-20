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


export const useUpdateRevenuePath = <T>(queryOpts?: QueryOptions) => {
  const { client } = useContext(R3vlContext)

  return {
    updateRevenueTier: useMutation(
      ['/updateRevenueTier'],
      async (args: UpdateRevenueTierV1Args) => {
        if (!client.updateRevenueTier) return

        return await client.updateRevenueTier(args)
      },
      queryOpts
    ),
    updateErc20Distribution: useMutation(
      ['/updateErc20Distribution'],
      async (args: UpdateErc20DistributionArgs) => {
        if (!client.updateErc20Distribution) return

        return await client.updateErc20Distribution(args)
      },
      queryOpts
    ),
    updateFinalFund: useMutation(
      ['/updateFinalFund'],
      async (args: UpdateFinalFundArgs) => {
        if (!client.updateFinalFund) return

        return await client.updateFinalFund(args)
      },
      queryOpts
    ),
    addRevenueTier: useMutation(
      ['/addRevenueTier'],
      async (args: AddRevenueTierV1Args) => {
        if (!client.addRevenueTier) return

        return await client.addRevenueTier(args)
      },
      queryOpts
    ),
    addRevenueTiers: useMutation(
      ['/addRevenueTiers'],
      async (args: AddRevenueTiersV2Args) => {
        if (!client.addRevenueTiers) return

        return await client.addRevenueTiers(args)
      },
      queryOpts
    ),
    updateRevenueTiers: useMutation(
      ['/updateRevenueTiers'],
      async (args: UpdateRevenueTiersV2Args) => {
        if (!client.updateRevenueTiers) return

        return await client.updateRevenueTiers(args)
      },
      queryOpts
    ),
    updateLimits: useMutation(
      ['/updateLimits'],
      async (args: UpdateLimitsV2Args) => {
        if (!client.updateLimits) return

        return await client.updateLimits(args)
      },
      queryOpts
    )
  }
}
