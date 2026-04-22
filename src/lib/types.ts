export interface TokenListing {
  address: string;
  symbol?: string;
  name?: string;
  liquidity?: number;
  marketCap?: number;
  logoURI?: string;
  decimals?: number;
  price?: number;
  volume24h?: number;
  extensions?: Record<string, string>;
}

export interface TokenSecurity {
  creatorAddress?: string;
  creatorBalance?: number;
  ownerAddress?: string;
  ownerBalance?: number;
  mutableMetadata?: boolean;
  mintable?: boolean;
  freezeAuthority?: boolean;
  transferFeeEnable?: boolean;
  isToken2022?: boolean;
  top10HolderPercent?: number;
  top10UserBalance?: number;
  lpLockedPercent?: number;
  lpBurnedPercent?: number;
  holder?: number;
  freezeable?: boolean;
  nonTransferable?: boolean;
  trustScore?: number;
  [key: string]: unknown;
}

export interface RankedToken {
  token: TokenListing;
  security: TokenSecurity | null;
  score: number;
  flags: string[];
}
