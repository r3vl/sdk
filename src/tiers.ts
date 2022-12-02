import { R3vlClient } from './client'
import { communityProvider, communitySigner, getChainId } from './utils'

async function main() {
  const provider = communityProvider()
  const signer = communitySigner()
  const chainId = await getChainId()

  const clientV1 = new R3vlClient({
    chainId,
    provider,
    signer,
    revPathAddress: '0xa534eE5f43893D7425cB4773024Fcc75D635E3C3'
  })

  clientV1.v1.init() // TODO: throw error if init was not called

  const tiers = await clientV1.v1.tiers({})

  console.log("RESULT::..", tiers)

  return
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
