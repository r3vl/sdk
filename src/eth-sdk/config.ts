import { defineConfig } from '@dethcrypto/eth-sdk'

export default defineConfig({
  outputPath: 'dist/sdk-client',
  contracts: {
    mainnet: {
      reveelMainV0: '0x1b5aa0D926ea3c4C4485Ba447c9ABd9A5A128967',
      reveelMainV1: '0x320becCdfbed31a84A0c6E6F678320814B400BBe',
      reveelMainV2: '0xae4EfaEB758f149f9C780268986537E45Bd57d7C',
      reveelMainV2Final: '0xc61641DEEdf811C8A1F515DEF22C1f7a04891C83',
      reveelMainSimple: '0xBC8B684B6De76E00E4D11536b7c928B0f8011d8C',
      pathLibraryV0: '0x92582A5091A55A8Cd168A927ec100fDD13Ec0f20',
      pathLibraryV1: '0x9C23D192313b60225459bee71BC96cF49740418E',
      pathLibraryV2: '0x0000000000000000000000000000000000000000', // TODO: Get correct mainnet address
      pathLibraryV2Final: '0x698A4Ccd56Cf95d489Ba5d5DC00C5A2BEA9837C4',
      pathLibrarySimple: '0x9f5808662520633DaeB0f30ef6659e64189Cb193',
      weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    },
    goerli: {
      reveelMainV0: '0x0000000000000000000000000000000000000000', // TODO: Get correct goerli address
      reveelMainV1: '0xff960959d00DbbaB1096C3A9a13E81e239d1c374',
      reveelMainV2: '0xd7A866AB8bd9e91C10214A6a75F5f4E95826b053',
      reveelMainV2Final: '0xbAde3569A146d896F3490153e30b71106f1A7Fd6',
      reveelMainSimple: '0x111630E67b025498E175CaaD0eEB879774236f22',
      pathLibraryV0: '0xc66d1E8d7337b60d8cf00850674FB6E1eE73D985',
      pathLibraryV1: '0x7c4D7B4e08d97f2c43804192898Ce773385ACd11',
      pathLibraryV2: '0x82AeaFc181f83a1AB53bBeFC2d8fdCc8C42a7707',
      pathLibraryV2Final: '0x3Bf91DabEAbcffeaF461677675EcDdae30e89fAE',
      pathLibrarySimple: '0xC3dBA32A5d9725a4540EEEcC753F2b6F3515c11d',
      weth: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      usdc: '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C',
      dai: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60'
    },
    polygonMumbai: {
      reveelMainV1: '0xb05Bcdfd259D08728db7517bf3c3CC4262D3b451',
      reveelMainV2: '0x5559a2d54906F8a288cD99282E1458c585866e02',
      reveelMainV2Final: '0xcf5FD52CA0cCF751B3cEcD04C124446939937951',
      reveelMainSimple: '0x5Bf756A088F2cF8B97D9c6Cbc29B639862Ccf9d6',
      pathLibraryV1: '0x0000000000000000000000000000000000000000',
      pathLibraryV2: '0xf0e3FB69B3F2c62476c882CEB9E084E37252663c',
      pathLibraryV2Final: '0x346038337Eeb979B2A47bB6c67F1d1894D335670',
      pathLibrarySimple: '0x47A6e208D8E688Dd4717FE1Bb4d15b44FE4999Bc',
      weth: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
      usdc: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747',
      dai: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F'
    },
    polygon: {
      reveelMainV1: '0x0000000000000000000000000000000000000000',
      reveelMainV2: '0xEF44D8e4eAb1ACB4922B983253B5B50386E8668E',
      reveelMainV2Final: '0xFB20BcAeEA95a2B6619b7b64F47a00204779d03c',
      reveelMainSimple: '0x9cFAB8430cEC3295C62f562cD2e8B76cF3AB613C',
      pathLibraryV1: '0x0000000000000000000000000000000000000000',
      pathLibraryV2: '0x81d5b18d28368636c7d3C7565025203E9dBfA00b',
      pathLibraryV2Final: '0x6e3CAC8E17a5c5642efB1a6873eDD34AfE04AB3A',
      pathLibrarySimple: '0x3b3DB48e1291aFaBFe1755FfdF24A2159F8D8684',
      weth: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      usdc: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      dai: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
    },
    arbitrumTestnet: {
      reveelMainV1: '0x0000000000000000000000000000000000000000',
      reveelMainV2: '0xf0e3FB69B3F2c62476c882CEB9E084E37252663c',
      reveelMainV2Final: '0x0000000000000000000000000000000000000000',
      reveelMainSimple: '0x0000000000000000000000000000000000000000',
      pathLibraryV1: '0x0000000000000000000000000000000000000000',
      pathLibraryV2: '0x8f2E08314B3833a0A1C26AcFa27B3cbe9c92aF60',
      pathLibraryV2Final: '0x0000000000000000000000000000000000000000',
      pathLibrarySimple: '0x0000000000000000000000000000000000000000',
      weth: '0x0000000000000000000000000000000000000000',
      usdc: '0x0000000000000000000000000000000000000000',
      dai: '0x0000000000000000000000000000000000000000'
    },
    arbitrumOne: {
      reveelMainV1: '0xb05Bcdfd259D08728db7517bf3c3CC4262D3b451',
      reveelMainV2: '0xEF44D8e4eAb1ACB4922B983253B5B50386E8668E',
      reveelMainV2Final: '0x0000000000000000000000000000000000000000',
      reveelMainSimple: '0x0000000000000000000000000000000000000000',
      pathLibraryV1: '0x0000000000000000000000000000000000000000',
      pathLibraryV2: '0x81d5b18d28368636c7d3C7565025203E9dBfA00b',
      pathLibraryV2Final: '0x0000000000000000000000000000000000000000',
      pathLibrarySimple: '0x0000000000000000000000000000000000000000',
      weth: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      usdc: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
      dai: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
    },
    optimism: {
      reveelMainV1: '0xb05Bcdfd259D08728db7517bf3c3CC4262D3b451',
      reveelMainV2: '0xEF44D8e4eAb1ACB4922B983253B5B50386E8668E',
      reveelMainV2Final: '0xA1b3C49DBFAcE5aFD60A67a9387a41FA6d6899e6',
      reveelMainSimple: '0x698A4Ccd56Cf95d489Ba5d5DC00C5A2BEA9837C4',
      pathLibraryV1: '0x0000000000000000000000000000000000000000',
      pathLibraryV2: '0x81d5b18d28368636c7d3C7565025203E9dBfA00b',
      pathLibraryV2Final: '0x59d95a65DC0CA28588F204CB3c84f637c6A325fe',
      pathLibrarySimple: '0x19AA1Df5c022639AE3a0c3AB621Ba0299Da743d6',
      weth: '0x4200000000000000000000000000000000000006',
      usdc: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
      dai: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
    },
    optimismGoerli: {
      reveelMainV1: '0xb05Bcdfd259D08728db7517bf3c3CC4262D3b451',
      reveelMainV2: '0xEF44D8e4eAb1ACB4922B983253B5B50386E8668E',
      reveelMainV2Final: '0x0000000000000000000000000000000000000000',
      reveelMainSimple: '0x0000000000000000000000000000000000000000',
      pathLibraryV1: '0x0000000000000000000000000000000000000000',
      pathLibraryV2: '0xCBc16B945e6BD6ba43A27C72Ca728d2702194D8f',
      pathLibraryV2Final: '0x0000000000000000000000000000000000000000',
      pathLibrarySimple: '0x0000000000000000000000000000000000000000',
      weth: '0x0000000000000000000000000000000000000000',
      usdc: '0x0000000000000000000000000000000000000000',
      dai: '0x0000000000000000000000000000000000000000'
    },
    aurora: {
      reveelMainV1: '0xb05Bcdfd259D08728db7517bf3c3CC4262D3b451',
      reveelMainV2: '0x25A7516406FEe7394d40ece9f3EbFaB2a592b4ec',
      reveelMainV2Final: '0x0000000000000000000000000000000000000000',
      reveelMainSimple: '0x0000000000000000000000000000000000000000',
      pathLibraryV1: '0x0000000000000000000000000000000000000000',
      pathLibraryV2: '0xEF44D8e4eAb1ACB4922B983253B5B50386E8668E',
      pathLibraryV2Final: '0x0000000000000000000000000000000000000000',
      pathLibrarySimple: '0x0000000000000000000000000000000000000000',
      weth: '0xc9bdeed33cd01541e1eed10f90519d2c06fe3feb',
      usdc: '0xb12bfca5a55806aaf64e99521918a4bf0fc40802',
      dai: '0xe3520349f477a5f6eb06107066048508498a291b'
    },
    auroraTestnet: {
      reveelMainV1: '0xb05Bcdfd259D08728db7517bf3c3CC4262D3b451',
      reveelMainV2: '0xEF44D8e4eAb1ACB4922B983253B5B50386E8668E',
      reveelMainV2Final: '0x0000000000000000000000000000000000000000',
      reveelMainSimple: '0x0000000000000000000000000000000000000000',
      pathLibraryV1: '0x0000000000000000000000000000000000000000',
      pathLibraryV2: '0x81d5b18d28368636c7d3C7565025203E9dBfA00b',
      pathLibraryV2Final: '0x0000000000000000000000000000000000000000',
      pathLibrarySimple: '0x0000000000000000000000000000000000000000',
      weth: '0x0000000000000000000000000000000000000000',
      usdc: '0x0000000000000000000000000000000000000000',
      dai: '0x0000000000000000000000000000000000000000'
    }
  },
  rpc: {
    arbitrumTestnet: 'https://arb-goerli.g.alchemy.com/v2/Ila4k42v7NUxN-gJnfnyzjBS-aj07z8I',
    arbitrumOne: 'https://arb-mainnet.g.alchemy.com/v2/IzeL7B7NiRF0FAkq-LQn3aTmfKYv2QLm'
  },
})
