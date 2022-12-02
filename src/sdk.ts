
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

  const clientV2 = new R3vlClient({
    chainId,
    provider,
    signer,
    revPathAddress: '0x9fe8E2770F99D7c2Bcc555c3e952CDc5b95154CF'
  })

  clientV2.v2.requireSigner()

  // const updateTierResult = await clientV2.v2.updateRevenueTiers({
  //   walletList: [
  //     ['0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8']
  //   ],
  //   distribution: [ [100] ],
  //   tierNumbers: [ 0 ],
  // })

  // const updateLimitResult = await clientV2.v2.updateLimits({
  //   tokens: [
  //     'dai'
  //   ],
  //   newLimits: [ 2 ],
  //   tier: 0
  // })

  // const updateLimitResult = await clientV2.v2.addRevenueTiers({
  //   walletList: [['0x909e4e8fFE57e77f4851F6Ec24b037B562967833'], ['0x1334645C23Cb98c246332149F7dFbB5Eee123B07']],
  //   distribution: [[100], [100]],
  //   tiers: [
  //     { token: 'eth', limits: [1, 2] },
  //     { token: 'weth', limits: [1, 2] },
  //     { token: 'usdc', limits: [1, 2] },
  //     { token: 'dai', limits: [1, 2] }
  //   ],
  //   finalFundWalletList: ['0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8'],
  //   finalFundDistribution: [100],
  //   finalFundIndex: 1
  // })

  // console.log(updateLimitResult, 'updateLimitResult');

  return
}

sdkMain()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })