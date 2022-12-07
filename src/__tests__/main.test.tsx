import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { communityProvider, communitySigner, getChainId } from "../utils"
import { R3vlClient } from "../client"
import { R3vlProvider } from "../react"
import useBalances from "../react/hooks/withdrawn"

describe('Main', () => {
  let provider
  let signer
  let chainId
  let clientV1: R3vlClient

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
      const balances = useBalances({ walletAddress: "0x538C138B73836b811c148B3E4c3683B7B923A0E7" })

      if (balances.earnings === 0) return null

      return <div>
        Earnings: {balances.earnings}
      </div>
    }
    const Provider = () => {
      return <R3vlProvider client={clientV1.v1}>
        <HookTester />
      </R3vlProvider>
    }

    render(<Provider />)

    await waitFor(() => expect(screen.getByText(/Earnings: /)).toBeInTheDocument())
  })
})
