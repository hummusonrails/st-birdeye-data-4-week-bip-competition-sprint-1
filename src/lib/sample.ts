import type { TokenListing, TokenSecurity } from './types';

export const sampleListings: TokenListing[] = [
  {
    address: 'So11111111111111111111111111111111111111112',
    symbol: 'WIFRESH',
    name: 'WIFRESH Radar',
    liquidity: 180000,
    marketCap: 920000,
    price: 0.092,
    volume24h: 550000,
  },
  {
    address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    symbol: 'MINTY',
    name: 'Minty Risk',
    liquidity: 76000,
    marketCap: 610000,
    price: 0.014,
    volume24h: 120000,
  },
  {
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6G5Q8vXv4iTj9P6',
    symbol: 'LOCKD',
    name: 'Locked Liquidity',
    liquidity: 140000,
    marketCap: 830000,
    price: 0.031,
    volume24h: 310000,
  }
];

export const sampleSecurity: Record<string, TokenSecurity> = {
  So11111111111111111111111111111111111111112: {
    mintable: false,
    mutableMetadata: false,
    top10HolderPercent: 17,
    lpLockedPercent: 82,
    holder: 1120,
    trustScore: 84,
  },
  JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN: {
    mintable: true,
    mutableMetadata: true,
    top10HolderPercent: 61,
    lpLockedPercent: 21,
    holder: 114,
    trustScore: 31,
  },
  DezXAZ8z7PnrnRJjz3wXBoRgixCa6G5Q8vXv4iTj9P6: {
    mintable: false,
    mutableMetadata: false,
    top10HolderPercent: 23,
    lpLockedPercent: 74,
    holder: 870,
    trustScore: 72,
  }
};
