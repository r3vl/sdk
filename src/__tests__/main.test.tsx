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
  jest.setTimeout(80000)

  const provider = communityProvider()
  const signer = communitySigner()
  const chainId = 10
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

  test('Test useRevenuePaths', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = renderHook(
        () => {
          useR3vlClient({
            chainId,
            provider,
            signer,
            initV2Final: true
          })

          const r = useRevenuePaths()

          console.log("REVS", r?.dataRaw && r.dataRaw?.[0].eventPayload)
          return r
        },
        { wrapper }
      )
      await waitForNextUpdate({ timeout: 10000 })
      await waitForNextUpdate({ timeout: 10000 })
      await waitForNextUpdate({ timeout: 10000 })
      await waitForNextUpdate({ timeout: 10000 })
      await waitForNextUpdate({ timeout: 10000 })
      await waitForNextUpdate({ timeout: 10000 })
      await waitForNextUpdate({ timeout: 10000 })
      await waitForNextUpdate({ timeout: 10000 })

      expect(result.current).toBeTruthy()
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
            revPathAddress: '0xD41Fa1142E29742cbFe708C20cCcd690EC4A8E03',
            initV2Final: true,
            revPathMetadata: JSON.parse('{"walletList":[["0x0807c5C8Fa8a8229870CFecb6E2E71Dcb6a78261","0x5Ce5892FB75F63fB3c700ffe2Ac0Bb18F53dA80a"],["0x5Ce5892FB75F63fB3c700ffe2Ac0Bb18F53dA80a"]],"distribution":[["5","95"],[100]],"tiers":[{"matic":"0.5"}],"name":"Leo Polygon test path (1 tier) ","mutabilityDisabled":false}')
          })

          const r = useTransactionEvents('0xD41Fa1142E29742cbFe708C20cCcd690EC4A8E03')

          console.log("TXS:::", r.data)
          return r
        },
        { wrapper }
      )

      await waitForNextUpdate({ timeout: 50000 })
      await waitForNextUpdate({ timeout: 50000 })
      await waitForNextUpdate({ timeout: 50000 })
      await waitForNextUpdate({ timeout: 50000 })
      await waitForNextUpdate({ timeout: 50000 })
      await waitForNextUpdate({ timeout: 50000 })
      await waitForNextUpdate({ timeout: 50000 })

      expect(result?.current.data).toBeTruthy()
    })
  })

  test('Test useBalances', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = renderHook(
        () => {
          useR3vlClient({
            chainId,
            provider,
            revPathAddress: '0x132d6ED403500E62712f023A0277Ee112a2C73BB',
            initV2Final: true,
            revPathMetadata: JSON.parse('{"walletList":[["0x0807c5C8Fa8a8229870CFecb6E2E71Dcb6a78261","0x5e5E38626d419Df414e5AFd06121DFb041AEe2B2"],["0x0807c5C8Fa8a8229870CFecb6E2E71Dcb6a78261","0x5e5E38626d419Df414e5AFd06121DFb041AEe2B2"]],"distribution":[["90",10],["90",10]],"tiers":[{"eth":"0.0001"}],"name":"aldo beta v2 OP test 3","mutabilityDisabled":false}')
          })

          const r = useBalances('0x132d6ED403500E62712f023A0277Ee112a2C73BB', { walletAddress: "0x5e5E38626d419Df414e5AFd06121DFb041AEe2B2" })

          console.log("BALANCES:::", r.data)
          return r.data
        },
        { wrapper }
      )

      await waitForNextUpdate({ timeout: 50000 })
      await waitForNextUpdate({ timeout: 50000 })
      await waitForNextUpdate({ timeout: 50000 })
      await waitForNextUpdate({ timeout: 50000 })

      expect(result?.current?.withdrawn).toBeGreaterThanOrEqual(0)
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
            revPathAddress: '0xD41Fa1142E29742cbFe708C20cCcd690EC4A8E03',
            initV2Final: true,
            revPathMetadata: JSON.parse('{"walletList":[["0x0807c5C8Fa8a8229870CFecb6E2E71Dcb6a78261","0x5Ce5892FB75F63fB3c700ffe2Ac0Bb18F53dA80a"],["0x5Ce5892FB75F63fB3c700ffe2Ac0Bb18F53dA80a"]],"distribution":[["5","95"],[100]],"tiers":[{"matic":"0.5"}],"name":"Leo Polygon test path (1 tier) ","mutabilityDisabled":false}')
          })

          const r = useRevenuePathTiers('0xD41Fa1142E29742cbFe708C20cCcd690EC4A8E03')

          console.log("Tiers:", r.data?.[0], r.data?.[1])
          return r
        },
        { wrapper }
      )

      await waitForNextUpdate({ timeout: 20000 })
      await waitForNextUpdate({ timeout: 20000 })

      expect(result?.current.isFetched).toBeTruthy()
    })
  })

  test('Test transferOwnership', async () => {
    await act(async () => {
      const { result, waitForNextUpdate } = renderHook(
        () => {
          const r = useR3vlClient({
            chainId,
            provider,
            signer,
            revPathAddress: '0x05e22f1706310A23C79e94798f3cc82D4B05981E',
            initV2: true,
          })

          return r as any
        },
        { wrapper }
      )

      await waitForNextUpdate({ timeout: 20000 })


      const response = result?.current &&
        result.current["0x05e22f1706310A23C79e94798f3cc82D4B05981E"] &&
        result.current["0x05e22f1706310A23C79e94798f3cc82D4B05981E"]?.transferOwnerhip &&
        await result.current["0x05e22f1706310A23C79e94798f3cc82D4B05981E"]?.transferOwnerhip(
          "0x538C138B73836b811c148B3E4c3683B7B923A0E7",
          { isGasLess: true, gasLessKey: "td_LNEKbeMG7OK0OS159IAS3rJTQK8i0kr19NehIxcQ_" }
        )

      console.log(
        "META::", response
      )

      expect(result).toBeTruthy()
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
