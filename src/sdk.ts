
import { R3vlClient } from './client'
import { communityProvider, communitySigner, getChainId } from './utils';

async function sdkMain() {
  const provider = communityProvider()
  const signer = communitySigner()
  const chainId = await getChainId()

  const clientV0 = new R3vlClient({
    chainId,
    provider,
    signer,
    revPathAddress: '0x1304f8507Fc76EDd68E74E2c375b4F6c56DfCb90'
  })

  clientV0.v0.init()

  const result = await clientV0.v0.withdrawable({
    walletAddress: '0xC7905a55e936FEe08Ec8720283fADf9DcFE1dBd8',
    isERC20: 'weth'
  })

  console.log("RESULT V0:::...", result)

  const clientV1 = new R3vlClient({
    chainId,
    provider,
    signer,
    revPathAddress: '0xa534eE5f43893D7425cB4773024Fcc75D635E3C3'
  })

  clientV1.v1.init()

  const result1 = await clientV1.v1.withdrawable({
    walletAddress: '0x538C138B73836b811c148B3E4c3683B7B923A0E7',
  })

  console.log("RESULT V1:::...", result1)

  const clientV1RequireSigner = new R3vlClient({
    chainId,
    provider,
    signer,
  })

  clientV1RequireSigner.v1.requireSigner()

  const createResult = await clientV1RequireSigner.v1.createRevenuePath({
    walletList: [
      [
        "0x1334645C23Cb98c246332149F7dFbB5Eee123B07"
      ],
      [
        "0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8"
      ]
    ],
    distribution: [
      [ 100 ],
      [ 100 ]
    ], 
    tierLimits: [ 2 ], 
    name: "revPath new", 
    mutabilityEnabled: false 
  })

  console.log(createResult, 'createResult');

  return
}

sdkMain()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })