import React, { useEffect } from "react"
import { render, screen, waitFor, act } from "@testing-library/react"
import { renderHook } from '@testing-library/react-hooks'


import { communityProvider, communitySigner } from "../testing/utils"
import { R3vlProvider, createClient } from "../react"
import { useBalances } from "../react/hooks/useBalances"
import { useWithdraw } from "../react/hooks/useWithdraw"
// import { useEvents } from "../react/hooks/useEvents"
import { useCreateRevenuePath } from "../react/hooks/useCreateRevenuePath"
import { useUpdateRevenuePath } from "../react/hooks/useUpdateRevenuePath"
import { FnArgs as CreateRevenuePathV1Args } from "../createRevenuePathV1"
import { PaymentReleasedEvent as PaymentReleasedEventV1 } from "../typechain/PathLibraryV1"
import { useR3vlClient, useRevenuePaths, useRevenuePathTiers, useTransactionEvents } from "../react/hooks"
import { ethers } from "ethers"

const client = createClient()

describe('Main', () => {
  jest.setTimeout(10000)

  const provider = communityProvider()
  const signer = communitySigner()
  const chainId = 1
  const wrapper = ({ children }: { children: any }) => {
    return (
      <R3vlProvider client={client}>
        {children}
      </R3vlProvider>
    )
  }
  const wrapperConfig = ({ children }: { children: any }) => {
    return (
      <R3vlProvider client={client} config={{
        chainId,
        provider,
        signer,
        revPathAddress: '0x8EAd913DF8a741D121026424bE5e07cD1651CBd7'
      }}>
        {children}
      </R3vlProvider>
    )
  }

  test('Test useR3vlClient', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = renderHook(() => useR3vlClient({
        chainId,
        provider,
        signer,
        revPathAddress: '0x663c5A6fd46E9c9D20c8C174FD555079f8879F87'
      }), { wrapper })

      await waitForNextUpdate()

      await waitFor(() => expect(result?.current?.['0x663c5A6fd46E9c9D20c8C174FD555079f8879F87']?.v).toEqual(2))
    })
  })

  test('Test useBalances', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = renderHook(
        () => {
          useR3vlClient({
            chainId,
            provider,
            signer,
            revPathAddress: '0x6F262b498768eb6ed461241ccd52CA4663649860'
          })

          const r = useBalances('0x6F262b498768eb6ed461241ccd52CA4663649860', { walletAddress: "0xD6d0c9fC8F1f6cbCa3472052df3678E5b29b2DcA" })

          console.log("META:::", r.data)
          return r.data || 0
        },
        { wrapper }
      )

      await waitForNextUpdate({ timeout: 9000 })
      await waitForNextUpdate({ timeout: 9000 })

      expect(result?.current).not.toBeNaN()
    })
  })

  test('Test useRevenuePaths', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = renderHook(
        () => {
          useR3vlClient({
            chainId,
            provider,
            signer,
          })

          const r = useRevenuePaths()

          return r
        },
        { wrapper }
      )

      await waitForNextUpdate()
      await waitForNextUpdate()

      expect(result.current.isFetched).toBeTruthy()
    })
  })

  test('Test useCreateRevenuePath', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = renderHook(
        () => {
          useR3vlClient({
            chainId,
            provider,
            signer,
          })

          const mutation = useCreateRevenuePath()

          return mutation
        },
        { wrapper }
      )

      await waitForNextUpdate()

      // expect(result.current({
      //   walletList: [["0xD6d0c9fC8F1f6cbCa3472052df3678E5b29b2DcA"]],
      //   distribution: [[100]],
      //   tiers: [
      //     {
      //       ETH: ethers.utils.parseEther("1"),
      //       WETH: ethers.utils.parseEther("0.5")
      //     },
      //     {
      //       ETH: ethers.utils.parseEther("1"),
      //       WETH: ethers.utils.parseEther("0.5")
      //     }
      //   ],
      //   name: "Test utest",
      //   mutabilityEnabled: true
      // })).toBeTruthy()

      try {
        await result.current.mutateAsync({} as any)
      } catch (error) {
        expect(error).toBeTruthy()
      }
    })
  })

  test('Test useTransactionEvents', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = renderHook(
        () => {
          useR3vlClient({
            chainId,
            provider,
            signer,
            revPathAddress: '0x663c5A6fd46E9c9D20c8C174FD555079f8879F87'
          })

          const r = useTransactionEvents('0x663c5A6fd46E9c9D20c8C174FD555079f8879F87')

          return r
        },
        { wrapper }
      )

      await waitForNextUpdate()
      await waitForNextUpdate()
      await waitForNextUpdate({ timeout: 5000 })

      expect(result?.current).toBeTruthy()
    })
  })

  test('Test useRevenuePathTiers', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = renderHook(
        () => {
          useR3vlClient({
            chainId,
            provider,
            signer,
            revPathAddress: '0x3f872C2A7E32d392f502c6c9756DC57B890c2FE1'
          })

          const r = useRevenuePathTiers('0x3f872C2A7E32d392f502c6c9756DC57B890c2FE1')

          console.log("MMMMM", r.data)
          return r
        },
        { wrapper }
      )

      await waitForNextUpdate({ timeout: 10000 })
      await waitForNextUpdate({ timeout: 10000 })
      await waitForNextUpdate({ timeout: 10000 })

      expect(result?.current.isFetched).toBeTruthy()
    })
  })

  // test('Test useBalances', async () => {
  //   const HookTester = () => {
  //     useR3vlClient({
  //       chainId,
  //       provider,
  //       signer,
  //       revPathAddress: '0xa534eE5f43893D7425cB4773024Fcc75D635E3C3'
  //     })
  //     const result = useBalances({ walletAddress: "0x538C138B73836b811c148B3E4c3683B7B923A0E7" })

  //     if (result.data?.earnings === 0) return null

  //     return <div>
  //       Earnings: {result.data?.earnings}
  //     </div>
  //   }

  //   await act(async () => {
  //     render(
  //       <Providers>
  //         <HookTester />
  //       </Providers>
  //     )
  
  //     await waitFor(() => expect(screen.getByText(/Earnings: /)).toBeInTheDocument())
  //   })
  // })

  // test('Test useWithdraw', async () => {
  //   const HookTester = () => {
  //     useR3vlClient({
  //       chainId,
  //       provider,
  //       signer,
  //       revPathAddress: '0xa534eE5f43893D7425cB4773024Fcc75D635E3C3'
  //     })
  //     const mutation = useWithdraw()

  //     return <div>
  //       <button onClick={() => mutation?.mutate({
  //         walletAddress: "0x538C138B73836b811c148B3E4c3683B7B923A0E7"
  //       })}>
  //         Withdraw Funds
  //       </button>
  //       {mutation?.isLoading && <div>Is loading...</div>}
  //     </div>
  //   }

  //   await act(async () => {
  //     render(
  //       <Providers>
  //         <HookTester />
  //       </Providers>
  //     )

  //     expect(screen.getByText(/Withdraw Funds/)).toBeInTheDocument()
  //   })
  // })

  // test('Test useEvents', async () => {
  //   const HookTester = () => {
  //     useR3vlClient({
  //       chainId,
  //       provider,
  //       signer,
  //       revPathAddress: '0xa534eE5f43893D7425cB4773024Fcc75D635E3C3'
  //     })
  //     const query = useEvents<PaymentReleasedEventV1>()

  //     if (query?.isLoading) return <div>
  //       loading....
  //     </div>

  //     if (!query?.data && query?.isFetched) return null

  //     return <div>
  //       {query?.data && query?.data?.length > 0 && query?.data?.map(e => <p>wallet: {e.args.account}</p>)}
  //     </div>
  //   }

  //   await act(async () => {
  //     render(
  //       <Providers>
  //         <HookTester />
  //       </Providers>
  //     )

  //     await waitFor(() => expect(screen.getAllByText(/wallet/).length).toBeGreaterThan(0))
  //   })
  // })

  // test('Test useCreateRevenuePath', async () => {
  //   const HookTester = () => {
  //     useR3vlClient({
  //       chainId,
  //       provider,
  //       signer,
  //       revPathAddress: '0xa534eE5f43893D7425cB4773024Fcc75D635E3C3'
  //     })
  //     const mutation = useCreateRevenuePath<CreateRevenuePathV1Args>()

  //     if (mutation?.isLoading) return <div>
  //       loading....
  //     </div>

  //     return <div>
  //       <button onClick={() => {
  //         mutation?.mutate({
  //           walletList: [['0x538C138B73836b811c148B3E4c3683B7B923A0E7']],
  //           distribution: [[101]], 
  //           tierLimits: [10],
  //           name: 'utest rev path v1',
  //           mutabilityEnabled: true
  //         })
  //       }}>Create Revenue Path V1</button>
  //     </div>
  //   }

  //   await act(async () => {
  //     render(
  //       <Providers>
  //         <HookTester />
  //       </Providers>
  //     )

  //     expect(screen.getByText(/Create Revenue Path V1/)).toBeInTheDocument()
  //   })
  // })

  // test('Test useUpdateRevenuePath', async () => {
  //   const HookTester = () => {
  //     useR3vlClient({
  //       chainId,
  //       provider,
  //       signer,
  //       revPathAddress: '0xa534eE5f43893D7425cB4773024Fcc75D635E3C3'
  //     })
  //     const mutation = useUpdateRevenuePath()

  //     if (mutation?.updateErc20Distribution?.isLoading) return <div>
  //       loading....
  //     </div>

  //     useEffect(() => {
  //       const fn = async () => {
  //         const response = await mutation?.updateLimits.mutateAsync({ tokens: [], newLimits: [], tier: 1 })

  //         return response
  //       }

  //       fn()
  //     }, [])

  //     return <div>
  //       <button onClick={() => {
  //         mutation?.updateErc20Distribution.mutate({
  //           walletList: ['0x0'],
  //           distribution: [10]
  //         })
  //       }}>Update V1 Rev Path</button>
  //     </div>
  //   }

  //   await act(async () => {
  //     render(
  //       <Providers>
  //         <HookTester />
  //       </Providers>
  //     )

  //     expect(screen.getByText(/Update V1 Rev Path/)).toBeInTheDocument()
  //   })
  // })
})
