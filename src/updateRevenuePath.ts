import { ethers } from 'ethers'
import { updateErc20Distribution } from './updateErc20Distribution'
import { updateRevenueTierV1 } from './updateRevenueTierV1'
import { updateFinalFund } from './updateFinalFund'
import { communitySigner } from './utils'
import { addRevenueTierV1 } from './addRevenueTierV1'

async function main() {
  const signer = communitySigner()

  if(!signer) return

  // await addRevenueTierV1(
  //   signer,
  //   '0xC3267ba29975f998F5Bb1b393BAbe59B36A28f94',
  //   [ 
  //     ['0x909e4e8fFE57e77f4851F6Ec24b037B562967833'],
  //   ],
  //   [ [100] ],
  //   [ 3 ],
  //   [ '0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8' ],
  //   [ 100 ],
  //   0
  // )

  // await addRevenueTierV1(
  //   signer,
  //   '0xC3267ba29975f998F5Bb1b393BAbe59B36A28f94',
  //   [ 
  //     ['0x1334645C23Cb98c246332149F7dFbB5Eee123B07'],
  //     ['0x909e4e8fFE57e77f4851F6Ec24b037B562967833'],
  //   ],
  //   [ [100], [100] ],
  //   [ 5, 6 ],
  //   [ '0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8' ],
  //   [ 100 ],
  //   3
  // )


  // addRevenueTierV1 Example
  // await addRevenueTierV1(
  //   signer,
  //   '0xc0684Ef0f5786649C11f78D57339e18Ec869bb4D',
  //   [ 
  //     ['aram.eth'],
  //     ['0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8']
  //   ],
  //   [
  //     [100],
  //     [100]
  //   ],
  //   [7, 8],
  //   ['0x909e4e8fFE57e77f4851F6Ec24b037B562967833', '0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8'],
  //   [
  //     80,
  //     20
  //   ],
  //   6
  // )

  // updateRevenueTierV1 Example
  // await updateRevenueTierV1(
  //   signer,
  //   '0xC728713EE2FC255582C5683608BB7AAF9a52D5ba',
  //   [ "aram.eth" ],
  //   [ 100 ],
  //   3,
  //   1
  // )

  // await updateRevenueTierV1(
  //   signer,
  //   '0x03484b0d34F9FfaF3E1b62283adC92305DBc792C',
  //   ['0x909e4e8fFE57e77f4851F6Ec24b037B562967833', '0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8'],
  //   [50, 50],
  //   2,
  //   1
  // )

  // await updateErc20Distribution(    
  //   signer,
  //   '0x03484b0d34F9FfaF3E1b62283adC92305DBc792C',
  //   ['0x909e4e8fFE57e77f4851F6Ec24b037B562967833', '0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8'],
  //   [50, 50]
  // )

  // await updateFinalFund( signer,
  //   '0x767ece24C44f1A58be4eaF105ea7029f6F76fdA1',
  //   ['0x909e4e8fFE57e77f4851F6Ec24b037B562967833', '0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8'],
  //   [60, 40],
  //   0
  // )

  return
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })