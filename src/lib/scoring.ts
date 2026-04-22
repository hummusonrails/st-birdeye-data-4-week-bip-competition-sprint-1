import type { RankedToken, TokenListing, TokenSecurity } from './types';

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function scoreToken(token: TokenListing, security: TokenSecurity | null): RankedToken {
  const flags: string[] = [];
  let score = 50;

  const liquidity = toNumber(token.liquidity);
  const volume24h = toNumber(token.volume24h);
  const trustScore = toNumber(security?.trustScore);
  const holderCount = toNumber(security?.holder);
  const top10HolderPercent = toNumber(security?.top10HolderPercent);
  const lpLockedPercent = toNumber(security?.lpLockedPercent);

  score += Math.min(20, Math.round(liquidity / 15000));
  score += Math.min(10, Math.round(volume24h / 100000));
  score += Math.min(10, Math.round(holderCount / 200));
  score += Math.min(10, Math.round(trustScore / 10));

  if (security?.mintable) {
    score -= 25;
    flags.push('Mintable supply');
  }

  if (security?.mutableMetadata) {
    score -= 10;
    flags.push('Mutable metadata');
  }

  if (top10HolderPercent >= 50) {
    score -= 18;
    flags.push('Concentrated whale ownership');
  } else if (top10HolderPercent >= 30) {
    score -= 8;
    flags.push('Moderate holder concentration');
  }

  if (lpLockedPercent >= 70) {
    score += 8;
  } else if (lpLockedPercent > 0 && lpLockedPercent < 40) {
    score -= 6;
    flags.push('Low locked liquidity');
  }

  if (holderCount < 150) {
    score -= 8;
    flags.push('Thin holder base');
  }

  score = Math.max(0, Math.min(100, score));

  if (flags.length === 0) {
    flags.push('No major heuristic warnings');
  }

  return { token, security, score, flags };
}

export function rankTokens(tokens: TokenListing[], securityByAddress: Record<string, TokenSecurity | null>): RankedToken[] {
  return tokens
    .map((token) => scoreToken(token, securityByAddress[token.address] ?? null))
    .sort((left, right) => right.score - left.score);
}
