
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
  foundry: 31337
}

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
  weth: {
    name: "Wrapped Ether",
    [chainIds.goerli]: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    [chainIds.mainnet]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  dai: {
    name: "DAI",
    [chainIds.goerli]: "0x41e38e70a36150D08A8c97aEC194321b5eB545A5",
    [chainIds.mainnet]: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
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
