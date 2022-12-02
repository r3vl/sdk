import { withdrawnV0 } from './withdrawnV0'
import { withdrawnV1 } from './withdrawnV1'

async function main() {
  // await withdrawnV0('0x1304f8507Fc76EDd68E74E2c375b4F6c56DfCb90', '0x538C138B73836b811c148B3E4c3683B7B923A0E7')
  // await withdrawnV0('0x1304f8507Fc76EDd68E74E2c375b4F6c56DfCb90', '0x538C138B73836b811c148B3E4c3683B7B923A0E7', 'weth')
  // await withdrawnV1('0xa534eE5f43893D7425cB4773024Fcc75D635E3C3', '0x538C138B73836b811c148B3E4c3683B7B923A0E7')
  // await withdrawnV1('0xa534eE5f43893D7425cB4773024Fcc75D635E3C3', '0x538C138B73836b811c148B3E4c3683B7B923A0E7', 'weth')

  return
}

main()
  .then(() => console.log('DONE'))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
