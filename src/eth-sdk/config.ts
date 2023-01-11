import { defineConfig } from '@dethcrypto/eth-sdk'

export default defineConfig({
  outputPath: 'dist/sdk-client',
  contracts: {
    mainnet: {
      reveelMainV0: '0x1b5aa0D926ea3c4C4485Ba447c9ABd9A5A128967',
      reveelMainV1: '0x320becCdfbed31a84A0c6E6F678320814B400BBe',
      reveelMainV2: '0x320becCdfbed31a84A0c6E6F678320814B400BBe',
      pathLibraryV0: '0x92582A5091A55A8Cd168A927ec100fDD13Ec0f20',
      pathLibraryV1: '0x9C23D192313b60225459bee71BC96cF49740418E',
      pathLibraryV2: '0x82AeaFc181f83a1AB53bBeFC2d8fdCc8C42a7707', // TODO: Get correct mainnet address
      weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    },
    goerli: {
      reveelMainV0: '0xff960959d00DbbaB1096C3A9a13E81e239d1c374', // TODO: Get correct goerli address
      reveelMainV1: '0xff960959d00DbbaB1096C3A9a13E81e239d1c374',
      reveelMainV2: '0xd7A866AB8bd9e91C10214A6a75F5f4E95826b053',
      pathLibraryV0: '0xc66d1E8d7337b60d8cf00850674FB6E1eE73D985',
      pathLibraryV2: '0x82AeaFc181f83a1AB53bBeFC2d8fdCc8C42a7707',
      weth: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      usdc: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
      dai: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60'
    },
    polygonMumbai: {
      reveelMainV2: '0x5559a2d54906F8a288cD99282E1458c585866e02',
      pathLibraryV2: '0x82AeaFc181f83a1AB53bBeFC2d8fdCc8C42a7707', // TODO: Get correct address
      weth: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
      usdc: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747',
      dai: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F'
    },
    polygon: {
      reveelMainV2: '0xEF44D8e4eAb1ACB4922B983253B5B50386E8668E',
      pathLibraryV2: '0x82AeaFc181f83a1AB53bBeFC2d8fdCc8C42a7707', // TODO: Get correct address
      weth: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
      usdc: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747',
      dai: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F'
    }
  },
})
