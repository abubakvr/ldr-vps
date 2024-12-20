type Token = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
};

export const tokens: { [key: string]: Token } = {
  "0xAB3ABb5C1B69dC4fFe6B6FA0D633DD436E1639c2": {
    name: "Chedda Token",
    symbol: "CHEDDA",
    address: "0xAB3ABb5C1B69dC4fFe6B6FA0D633DD436E1639c2",
    decimals: 18,
  },
  "0xc349d33292F4958d5E616035241bE2ab2dE85100": {
    name: "USD Coin",
    symbol: "USDC",
    address: "0xc349d33292F4958d5E616035241bE2ab2dE85100",
    decimals: 6,
  },
  "0xF621E3fF2379d9a64a614A4D8C6b0dD6fa014A18": {
    name: "Tether USD",
    symbol: "USDT",
    address: "0xF621E3fF2379d9a64a614A4D8C6b0dD6fa014A18",
    decimals: 6,
  },
  "0xF6eea61d35B5A1DdCF7071eC7d5F6a62d649143b": {
    name: "DAI Stablecoin",
    symbol: "DAI",
    address: "0xF6eea61d35B5A1DdCF7071eC7d5F6a62d649143b",
    decimals: 18,
  },
  "0x2F59Dd801e498a4E80454cbf022313eAB7C5d511": {
    name: "Wrapped ETH",
    symbol: "WETH",
    address: "0x2F59Dd801e498a4E80454cbf022313eAB7C5d511",
    decimals: 18,
  },
  "0x12110BA7e972D03f90fCDe07F92e603f9D1ED982": {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    address: "0x12110BA7e972D03f90fCDe07F92e603f9D1ED982",
    decimals: 6,
  },
  "0x2d5246fcC20Df5Cdf5346254702a7cBD77E7DBC3": {
    name: "Aerodrome",
    symbol: "AERO",
    address: "0x2d5246fcC20Df5Cdf5346254702a7cBD77E7DBC3",
    decimals: 18,
  },
  "0x0414920Dc0C3Bb615A3d8EAA239D55c4258AAae0": {
    name: "AAVE",
    symbol: "AAVE",
    address: "0x0414920Dc0C3Bb615A3d8EAA239D55c4258AAae0",
    decimals: 18,
  },
  "0xC58bb755381C43FC8A9505fFa7C44d8737203300": {
    name: "Compound",
    symbol: "COMP",
    address: "0xC58bb755381C43FC8A9505fFa7C44d8737203300",
    decimals: 18,
  },
  "0x8166D0DeFb96900075a667FFb099DE8A493A4DfD": {
    name: "Uniswap",
    symbol: "UNI",
    address: "0x8166D0DeFb96900075a667FFb099DE8A493A4DfD",
    decimals: 18,
  },
  "0xFcA37314E6E1e399e7054C14B2746f3BC9F33fEB": {
    name: "Echelon Prime",
    symbol: "PRIME",
    address: "0xFcA37314E6E1e399e7054C14B2746f3BC9F33fEB",
    decimals: 18,
  },
  "0xc1e5599f1ac90995762302D946AF619bD9824813": {
    name: "Heroes of Mavia",
    symbol: "MAVIA",
    address: "0xc1e5599f1ac90995762302D946AF619bD9824813",
    decimals: 18,
  },
  "0xf66312E6e525271C4d8F65353a24bA593079739c": {
    name: "Gala",
    symbol: "GALA",
    address: "0xf66312E6e525271C4d8F65353a24bA593079739c",
    decimals: 18,
  },
  "0x85b21815bCe36a8AD51E8cba234E7A746FE1d41a": {
    name: "Beam",
    symbol: "BEAM",
    address: "0x85b21815bCe36a8AD51E8cba234E7A746FE1d41a",
    decimals: 18,
  },
  "0x9eb80c8E7b37bbbA9024D400F38Df6eC95d7D9AD": {
    name: "The Sandbox",
    symbol: "SAND",
    address: "0x9eb80c8E7b37bbbA9024D400F38Df6eC95d7D9AD",
    decimals: 18,
  },
  "0xF1cF6113d2f6B44Bffa7C44D82640Db4e721B48a": {
    name: "Coinbase Wrapped ETH",
    symbol: "cbETH",
    address: "0xF1cF6113d2f6B44Bffa7C44D82640Db4e721B48a",
    decimals: 18,
  },
  "0x1bf0aeb4C1A1C0896887814d679defcc1325EdE3": {
    name: "Coinbase Wrapped BTC",
    symbol: "cbBTC",
    address: "0x1bf0aeb4C1A1C0896887814d679defcc1325EdE3",
    decimals: 8,
  },
  "0x324bdE7aA1b130bE41E6eE79d5B6f60Db2dE2D62": {
    name: "Brett",
    symbol: "BRETT",
    address: "0x324bdE7aA1b130bE41E6eE79d5B6f60Db2dE2D62",
    decimals: 18,
  },
  "0x69c6AE47a9eCEB29b1d1a15c16f25AD9D74678df": {
    name: "Toshi",
    symbol: "TOSHI",
    address: "0x69c6AE47a9eCEB29b1d1a15c16f25AD9D74678df",
    decimals: 18,
  },
  "0x5BCf9dEe88Db86430E05bd244A31235163ee2B88": {
    name: "Basenji",
    symbol: "BENJI",
    address: "0x5BCf9dEe88Db86430E05bd244A31235163ee2B88",
    decimals: 18,
  },
  "0x54DDe893342e0295c0a9D4F188003Dca77067c6B": {
    name: "Mister Miggles",
    symbol: "MIGGLES",
    address: "0x54DDe893342e0295c0a9D4F188003Dca77067c6B",
    decimals: 18,
  },
};
