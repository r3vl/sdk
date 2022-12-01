import { defineConfig } from '@dethcrypto/eth-sdk'

export default defineConfig({
  contracts: {
    mainnet: {
      reveelMainV1: '0x320becCdfbed31a84A0c6E6F678320814B400BBe',
      pathLibraryV1: '0x9C23D192313b60225459bee71BC96cF49740418E',
      reveelMainV0: '0x1b5aa0D926ea3c4C4485Ba447c9ABd9A5A128967',
      pathLibraryV0: '0x92582A5091A55A8Cd168A927ec100fDD13Ec0f20',
      reveelMainV2: '0x320becCdfbed31a84A0c6E6F678320814B400BBe',
      pathLibraryV2: '', // TODO: Get correct mainnet address
      weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    },
    goerli: {
      reveelMain: '0xff960959d00DbbaB1096C3A9a13E81e239d1c374',
      pathLibraryV0: '0xc66d1E8d7337b60d8cf00850674FB6E1eE73D985',
      reveelMainV2: '0xd7A866AB8bd9e91C10214A6a75F5f4E95826b053',
      pathLibraryV2: '0x82AeaFc181f83a1AB53bBeFC2d8fdCc8C42a7707',
      weth: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      usdc: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
      dai: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60'
    }
  },
})
