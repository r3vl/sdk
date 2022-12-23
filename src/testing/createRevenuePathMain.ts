import { createRevenuePathV2 } from '../createRevenuePathV2';
import { communitySigner } from './utils';


async function main() {
  const signer = communitySigner()

  if(!signer) return

  // await createRevenuePathV2(
  //   signer,
  //   [
  //     ['aram.eth'],
  //     ['0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8']
  //   ],
  //   [ [100], [100] ],
  //   [
  //     { token: 'eth', limits: [1] },
  //     { token: 'weth', limits: [2] },
  //     { token: 'usdc', limits: [3] },
  //     { token: 'dai', limits: [4] }
  //   ],
  //   'path-v2',
  //   false
  // )

  return;
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })