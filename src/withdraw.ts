import { withdrawFundsV0 } from './withdrawV0'
import { withdrawFundsV1 } from './withdrawV1'

async function main() {
  await withdrawFundsV0("0xA2C7fBA66ef1C1010e72fc5Ee1eBff3b12b87e24", "0x538C138B73836b811c148B3E4c3683B7B923A0E7")
  await withdrawFundsV1("0x55E02C33dbe83C1bBCEDBB1F96ef4764aB758bE9", "0x538C138B73836b811c148B3E4c3683B7B923A0E7")
  await withdrawFundsV1("0x55E02C33dbe83C1bBCEDBB1F96ef4764aB758bE9", "0x5e5E38626d419Df414e5AFd06121DFb041AEe2B2")

  return
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
