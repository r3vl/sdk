import React, { useEffect } from "react"
import { render, screen, waitFor } from "@testing-library/react"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { communityProvider, communitySigner, getChainId } from "../testing/utils"
import { R3vlClient } from "../client"
import { R3vlProvider } from "../react"
import { useBalances } from "../react/hooks/useBalances"
import { useWithdraw } from "../react/hooks/useWithdraw"
import { useEvents } from "../react/hooks/useEvents"
import { useCreateRevenuePath } from "../react/hooks/useCreateRevenuePath"
import { useUpdateRevenuePath } from "../react/hooks/useUpdateRevenuePath"
import { FnArgs as CreateRevenuePathV1Args } from "../createRevenuePathV1"
import { PaymentReleasedEvent as PaymentReleasedEventV1 } from "../typechain/PathLibraryV1"

describe('Main', () => {
  let provider
  let signer
  let chainId
  let clientV1: R3vlClient
  const queryClient = new QueryClient()
  const Providers = ({ children }: { children: any }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <R3vlProvider client={clientV1.v1}>
          {children}
        </R3vlProvider>
      </QueryClientProvider>
    )
  }

  beforeAll(async () => {
    provider = communityProvider()
    signer = communitySigner()
    chainId = await getChainId()

    clientV1 = new R3vlClient({
      chainId,
      provider,
      signer,
      revPathAddress: '0xa534eE5f43893D7425cB4773024Fcc75D635E3C3'
    })

    clientV1.v1.init()
  })

  test('Test Sdk class is initializing correctly', async () => {
    expect(clientV1.initialized).toBeTruthy()
  })

  test('Test useBalances', async () => {
    const HookTester = () => {
      const result = useBalances({ walletAddress: "0x538C138B73836b811c148B3E4c3683B7B923A0E7" })

      if (result.data?.earnings === 0) return null

      return <div>
        Earnings: {result.data?.earnings}
      </div>
    }

    render(
      <Providers>
        <HookTester />
      </Providers>
    )

    await waitFor(() => expect(screen.getByText(/Earnings: /)).toBeInTheDocument())
  })

  test('Test useWithdraw', async () => {
    const HookTester = () => {
      const { mutate, isLoading } = useWithdraw()

      return <div>
        <button onClick={() => mutate({
          walletAddress: "0x538C138B73836b811c148B3E4c3683B7B923A0E7"
        })}>
          Withdraw Funds
        </button>
        {isLoading && <div>Is loading...</div>}
      </div>
    }

    render(
      <Providers>
        <HookTester />
      </Providers>
    )

    expect(screen.getByText(/Withdraw Funds/)).toBeInTheDocument()
  })

  test('Test useEvents', async () => {
    const HookTester = () => {
      const { data, isFetched, isLoading } = useEvents<PaymentReleasedEventV1>()

      if (isLoading) return <div>
        loading....
      </div>

      if (!data && isFetched) return null

      return <div>
        {data && data?.length > 0 && data?.map(e => <p>wallet: {e.args.account}</p>)}
      </div>
    }

    render(
      <Providers>
        <HookTester />
      </Providers>
    )

    await waitFor(() => expect(screen.getAllByText(/wallet/).length).toBeGreaterThan(0))
  })

  test('Test useCreateRevenuePath', async () => {
    const HookTester = () => {
      const mutation = useCreateRevenuePath<CreateRevenuePathV1Args>()

      if (mutation?.isLoading) return <div>
        loading....
      </div>

      return <div>
        <button onClick={() => {
          mutation?.mutate({
            walletList: [['0x538C138B73836b811c148B3E4c3683B7B923A0E7']],
            distribution: [[101]], 
            tierLimits: [10],
            name: 'utest rev path v1',
            mutabilityEnabled: true
          })
        }}>Create Revenue Path V1</button>
      </div>
    }

    render(
      <Providers>
        <HookTester />
      </Providers>
    )

    expect(screen.getByText(/Create Revenue Path V1/)).toBeInTheDocument()
  })

  test('Test useUpdateRevenuePath', async () => {
    const HookTester = () => {
      const { updateErc20Distribution, updateLimits } = useUpdateRevenuePath()

      if (updateErc20Distribution?.isLoading) return <div>
        loading....
      </div>

      useEffect(() => {
        const fn = async () => {
          const response = await updateLimits.mutateAsync({ tokens: [], newLimits: [], tier: 1 })

          return response
        }

        fn()
      }, [])

      return <div>
        <button onClick={() => {
          updateErc20Distribution.mutate({
            walletList: ['0x0'],
            distribution: [10]
          })
        }}>Update V1 Rev Path</button>
      </div>
    }

    render(
      <Providers>
        <HookTester />
      </Providers>
    )

    expect(screen.getByText(/Update V1 Rev Path/)).toBeInTheDocument()
  })
})
