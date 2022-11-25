import { createRevenuePathV1 } from './createRevenuePathV1'

async function main() {
  await createRevenuePathV1(
    [
      [
        "0x1334645C23Cb98c246332149F7dFbB5Eee123B07"
      ],
      [
        "0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8"
      ]
    ],
    [
      [ 100 ],
      [ 100 ]
    ],
    [ 2 ],
    "revPath new",
    false
)

// await createRevenuePathV1(
//   [ ["0x14706ad7bEf1c8d76c4a4495d4c16B6AeA43D4D8"] ],
//   [ [100] ],
//   [],
//   "revPath new",
//   false
// )

  return
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })