import { ethers } from 'ethers'
import { updateErc20Distribution } from './updateErc20Distribution'
import { updateRevenueTierV1 } from './updateRevenueTierV1'
import { updateFinalFund } from './updateFinalFundV1'
import { communitySigner } from './utils'
import { addRevenueTierV1 } from './addRevenueTierV1'

async function main() {
  const signer = communitySigner()

  if(!signer) return

  // addRevenueTierV1 Example
  // await addRevenueTierV1(
  //   signer,
  //   '0xc0684Ef0f5786649C11f78D57339e18Ec869bb4D',
  //   [ 
  //     ['aram.eth'],
  //     ['0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8']
  //   ],
  //   [
  //     [Number(ethers.utils.parseUnits('100', 5).toString())],
  //     [Number(ethers.utils.parseUnits('100', 5).toString())]
  //   ],
  //   [7, 8],
  //   ['0x909e4e8fFE57e77f4851F6Ec24b037B562967833', '0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8'],
  //   [
  //     Number(ethers.utils.parseUnits('80', 5).toString()),
  //     Number(ethers.utils.parseUnits('20', 5).toString())
  //   ],
  //   6
  // )

// addRevenueTierV1 Example
  // await updateRevenueTierV1(
  //   signer,
  //   '0x03484b0d34F9FfaF3E1b62283adC92305DBc792C',
  //   [ "0x909e4e8fFE57e77f4851F6Ec24b037B562967833" ],
  //   [ 100 ],
  //   3,
  //   0
  // )

  await updateRevenueTierV1(
    signer,
    '0x03484b0d34F9FfaF3E1b62283adC92305DBc792C',
    ['0x909e4e8fFE57e77f4851F6Ec24b037B562967833', '0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8'],
    [50, 50],
    2,
    1
  )

  await updateErc20Distribution(    
    signer,
    '0x03484b0d34F9FfaF3E1b62283adC92305DBc792C',
    ['0x909e4e8fFE57e77f4851F6Ec24b037B562967833', '0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8'],
    [50, 50]
  )

  await updateFinalFund( signer,
    '0x03484b0d34F9FfaF3E1b62283adC92305DBc792C',
    ['0x909e4e8fFE57e77f4851F6Ec24b037B562967833', '0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8'],
    [80, 20],
    1
  )

  return
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })