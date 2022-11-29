import { communitySigner } from './utils';
import { updateRevenueTiersV2 } from './updateRevenueTiersV2';
import { updateLimitsV2 } from './updateLimitsV2';


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

  await updateLimitsV2(
    signer,
    '0x9953BC4b5D8C9b812dff04b1755c18a5124927b3',
    [
      'weth',
      'usdc'
    ],
    [ 2, 3 ],
    0,
  )

  return;
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })