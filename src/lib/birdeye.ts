import { sampleListings, sampleSecurity } from './sample';
import type { TokenListing, TokenSecurity } from './types';

const API_ROOT = 'https://public-api.birdeye.so';

function normalizeListings(payload: unknown): TokenListing[] {
  const candidates = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { data?: unknown })?.data)
      ? (payload as { data: unknown[] }).data
      : Array.isArray((payload as { data?: { items?: unknown[] } })?.data?.items)
        ? (payload as { data: { items: unknown[] } }).data.items
        : [];

  return candidates.map((entry) => {
    const token = entry as Record<string, unknown>;
    return {
      address: String(token.address ?? token.tokenAddress ?? ''),
      symbol: token.symbol ? String(token.symbol) : undefined,
      name: token.name ? String(token.name) : undefined,
      liquidity: Number(token.liquidity ?? token.liquidityUsd ?? token.liquidity_usd ?? 0),
      marketCap: Number(token.marketCap ?? token.market_cap ?? 0),
      logoURI: token.logoURI ? String(token.logoURI) : undefined,
      decimals: Number(token.decimals ?? 0),
      price: Number(token.price ?? token.priceUsd ?? token.price_usd ?? 0),
      volume24h: Number(token.volume24h ?? token.v24hUSD ?? token.volume_24h_usd ?? 0),
    };
  }).filter((token) => token.address);
}

function normalizeSecurity(payload: unknown): TokenSecurity {
  if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    return ((payload as { data?: TokenSecurity }).data ?? {}) as TokenSecurity;
  }
  return (payload as TokenSecurity) ?? {};
}

async function getJson(path: string, apiKey: string, params: Record<string, string>): Promise<unknown> {
  const url = new URL(`${API_ROOT}${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url, {
    headers: {
      'X-API-KEY': apiKey,
      'x-chain': 'solana',
    },
  });

  if (!response.ok) {
    throw new Error(`Birdeye request failed (${response.status}) for ${path}`);
  }

  return response.json();
}

export async function fetchNewListings(apiKey: string): Promise<TokenListing[]> {
  if (!apiKey) {
    return sampleListings;
  }

  const payload = await getJson('/defi/v2/tokens/new_listing', apiKey, {
    limit: '10',
    meme_platform_enabled: 'true',
  });

  const listings = normalizeListings(payload);
  return listings.length > 0 ? listings : sampleListings;
}

export async function fetchSecurityMap(apiKey: string, addresses: string[]): Promise<Record<string, TokenSecurity | null>> {
  if (!apiKey) {
    return sampleSecurity;
  }

  const entries = await Promise.all(addresses.map(async (address) => {
    try {
      const payload = await getJson('/defi/token_security', apiKey, { address });
      return [address, normalizeSecurity(payload)] as const;
    } catch {
      return [address, null] as const;
    }
  }));

  return Object.fromEntries(entries);
}
