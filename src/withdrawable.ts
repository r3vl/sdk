import { withdrawableV0 } from './withdrawableV0'

async function main() {
  await withdrawableV0("0xA2C7fBA66ef1C1010e72fc5Ee1eBff3b12b87e24", "0x538C138B73836b811c148B3E4c3683B7B923A0E7")

  return
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
