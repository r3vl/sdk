
import { R3vlClient } from './client'
import { communityProvider, communitySigner, getChainId } from './utils';

async function sdkMain() {
  const provider = communityProvider()
  const signer = communitySigner()
  const chainId = await getChainId()

  const client = new R3vlClient({
    chainId,
    provider,
    signer,
    revPathAddress: '0x1304f8507Fc76EDd68E74E2c375b4F6c56DfCb90'
  })

  client.v0.init()

  const result = await client.v0.withdrawable({
    walletAddress: '0xC7905a55e936FEe08Ec8720283fADf9DcFE1dBd8',
    isERC20: 'weth'
  })

  console.log("RESULT:::...", result)

  return
}

sdkMain()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })