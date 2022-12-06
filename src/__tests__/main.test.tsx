import React from "react"
import { render } from "@testing-library/react"
import { communityProvider, communitySigner, getChainId } from "../utils"
import { R3vlClient } from "../client"

describe('Main', () => {
  test(' - ', async () => {
    const provider = communityProvider()
    const signer = communitySigner()
    const chainId = await getChainId()

    const clientV1 = new R3vlClient({
      chainId,
      provider,
      signer,
      revPathAddress: '0xa534eE5f43893D7425cB4773024Fcc75D635E3C3'
    })

    clientV1.v1.init()

    expect(clientV1.initialized).toBeTruthy()
  })
})
