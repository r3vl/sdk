export declare const chainIds: {
  readonly mainnet: 1
  readonly ropsten: 3
  readonly rinkeby: 4
  readonly goerli: 5
  readonly kovan: 42
  readonly sepolia: 11155111
  readonly optimism: 10
  readonly optimismKovan: 69
  readonly optimismGoerli: 420
  readonly polygon: 137
  readonly polygonMumbai: 80001
  readonly arbitrum: 42161
  readonly arbitrumRinkeby: 421611
  readonly arbitrumGoerli: 421613
  readonly localhost: 1337
  readonly hardhat: 31337
  readonly foundry: 31337
}

export type ChainIds = typeof chainIds[keyof typeof chainIds]
export type ChainIdType = { [key in ChainIds]: string }

export type Token = ChainIdType & {
  name: string
}

export const tokenList = {
  gor: {
    name: "Goerli",
  },
  eth: {
    name: "Ethereum",
  },
  weth: {
    name: "Wrapped Ether",
    [chainIds.goerli]: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    [chainIds.mainnet]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  dai: {
    name: "DAI",
    [chainIds.goerli]: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
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
