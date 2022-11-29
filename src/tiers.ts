import { tiersV1 } from './tiersV1'

async function main() {
  await tiersV1('0xa534eE5f43893D7425cB4773024Fcc75D635E3C3', '0x538C138B73836b811c148B3E4c3683B7B923A0E7')

  return
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
