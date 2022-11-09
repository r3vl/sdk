import { defineConfig } from '@dethcrypto/eth-sdk'

export default defineConfig({
  contracts: {
    mainnet: {
      reveelMainV1: '0x320becCdfbed31a84A0c6E6F678320814B400BBe',
      pathLibraryV1: '0x9C23D192313b60225459bee71BC96cF49740418E',
      reveelMainV0: '0x1b5aa0D926ea3c4C4485Ba447c9ABd9A5A128967',
      pathLibraryV0: '0x92582A5091A55A8Cd168A927ec100fDD13Ec0f20'
    },
    goerli: {
      reveelMain: '0xff960959d00DbbaB1096C3A9a13E81e239d1c374'
    }
  },
})