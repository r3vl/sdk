
export const chainIds = {
  mainnet: 1,
  ropsten: 3,
  rinkeby: 4,
  goerli: 5,
  kovan: 42,
  sepolia: 11155111,
  optimism: 10,
  optimismKovan: 69,
  optimismGoerli: 420,
  polygon: 137,
  polygonMumbai: 80001,
  arbitrum: 42161,
  arbitrumRinkeby: 421611,
  arbitrumGoerli: 421613,
  localhost: 1337,
  hardhat: 31337,
  foundry: 31337,
  aurora: 1313161554,
  auroraTestnet: 1313161555
}

export const getTokenListByAddress = (chainId: number) => Object.keys(tokenList).reduce((prev, curr) => { return { ...prev, [tokenList[curr as keyof typeof tokenList][chainId]]: curr } }, {})

export type ChainIds = typeof chainIds[keyof typeof chainIds]
export type ChainIdType = { [key in ChainIds]: string }

export type Token = ChainIdType & {
  name: string
}

export const tokenList = {
  gor: {
    name: "Goerli",
    [chainIds.goerli]: "0x0000000000000000000000000000000000000000",
    [chainIds.mainnet]: "0x0000000000000000000000000000000000000000",
  },
  eth: {
    name: "Ethereum",
    [chainIds.goerli]: "0x0000000000000000000000000000000000000000",
    [chainIds.mainnet]: "0x0000000000000000000000000000000000000000",
  },
  matic: {
    name: "Matic",
    [chainIds.polygon]: "0x0000000000000000000000000000000000001010",
    [chainIds.polygonMumbai]: '0xca11bde05977b3631167028862be2a173976ca11'
  },
  weth: {
    name: "Wrapped Ether",
    [chainIds.goerli]: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    [chainIds.mainnet]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  dai: {
    name: "DAI",
    [chainIds.goerli]: "0x41e38e70a36150D08A8c97aEC194321b5eB545A5",
    [chainIds.mainnet]: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    [chainIds.polygon]: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    [chainIds.optimism]: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    [chainIds.arbitrum]: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    [chainIds.aurora]: '0xe3520349f477a5f6eb06107066048508498a291b',
    [chainIds.polygonMumbai]: '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253',
    [chainIds.optimismGoerli]: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    [chainIds.arbitrumGoerli]: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    [chainIds.auroraTestnet]: "0xe3520349F477A5F6EB06107066048508498A291b",
  },
  usdc: {
    name: "USD Coin",
    [chainIds.goerli]: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
    [chainIds.mainnet]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
} as {
  gor: Token
  eth: Token
  weth: Token
  dai: Token
  usdc: Token
}

export const contractsDeployedV2 = {
  [chainIds.mainnet]: 16_084_329,
  [chainIds.goerli]: 7_952_086,
  [chainIds.polygon]: 36_261_597,
  [chainIds.polygonMumbai]: 29_418_579,
  [chainIds.aurora]: 79_775_191,
  [chainIds.auroraTestnet]: 106_512_994,
  [chainIds.optimism]: 46_912_175,
  [chainIds.optimismGoerli]: 3_299_818,
  [chainIds.arbitrum]: 43_041_420,
  [chainIds.arbitrumGoerli]: 2_131_251
}
