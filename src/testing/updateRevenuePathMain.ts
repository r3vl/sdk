import { communitySigner } from "./utils";


async function main() {
  const signer = communitySigner()

  if(!signer) return

  // await updateRevenueTiersV2(
  //   signer,
  //   '0x9953BC4b5D8C9b812dff04b1755c18a5124927b3',
  //   [
  //     ['0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8']
  //   ],
  //   [ [100] ],
  //   [ 3 ],
  // )

  // await updateLimitsV2(
  //   signer,
  //   '0x726534B9f3A2aD70f82914bBA66E943653ec59cB',
  //   [
  //     'dai'
  //   ],
  //   [ 7 ],
  //   2,
  // )

  // await addRevenueTiersV2(
  //   signer,
  //   '0x726534B9f3A2aD70f82914bBA66E943653ec59cB',
  //   [['armen.eth'], ['aram.eth']],
  //   [[100], [100]],
  //   [
  //     { token: 'eth', limits: [1, 2] },
  //     { token: 'weth', limits: [3, 4] },
  //     { token: 'usdc', limits: [5, 6] },
  //     { token: 'dai', limits: [7, 8] }
  //   ],
  //   ['0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8'],
  //   [100],
  //   0,
  // )

  // await addRevenueTiersV2(
  //   signer,
  //   '0x726534B9f3A2aD70f82914bBA66E943653ec59cB',
  //   [['armen.eth'], ['aram.eth']],
  //   [[100], [100]],
  //   [
  //     { token: 'eth', limits: [1, 2] },
  //     { token: 'weth', limits: [1, 2] },
  //     { token: 'usdc', limits: [1, 2] },
  //     { token: 'dai', limits: [1, 2] }
  //   ],
  //   ['0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8'],
  //   [100],
  //   7,
  // )

  // await addRevenueTiersV2(
  //   signer,
  //   '0xdf8A8666C68Eed6cfbf213A46dB246a6749C0Bf4',
  //   [['armen.eth'], ['aram.eth']],
  //   [[100], [100]],
  //   [
  //     { token: 'eth', limits: [1, 2] },
  //     { token: 'weth', limits: [1, 2] },
  //     { token: 'usdc', limits: [1, 2] },
  //     { token: 'dai', limits: [1, 2] }
  //   ],
  //   ['0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8'],
  //   [100],
  //   8,
  // )

  return;
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })