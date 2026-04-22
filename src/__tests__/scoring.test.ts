import { describe, expect, it } from 'vitest';
import { rankTokens, scoreToken } from '../lib/scoring';

const strongToken = {
  address: 'good',
  symbol: 'GOOD',
  liquidity: 150000,
  volume24h: 450000,
};

const weakToken = {
  address: 'bad',
  symbol: 'BAD',
  liquidity: 18000,
  volume24h: 12000,
};

describe('scoreToken', () => {
  it('rewards healthier listings', () => {
    const ranked = rankTokens(
      [strongToken, weakToken],
      {
        good: {
          mintable: false,
          mutableMetadata: false,
          top10HolderPercent: 18,
          lpLockedPercent: 80,
          holder: 980,
          trustScore: 90,
        },
        bad: {
          mintable: true,
          mutableMetadata: true,
          top10HolderPercent: 66,
          lpLockedPercent: 10,
          holder: 70,
          trustScore: 20,
        },
      }
    );

    expect(ranked[0].token.address).toBe('good');
    expect(ranked[0].score).toBeGreaterThan(ranked[1].score);
  });

  it('adds clear flags for major risk patterns', () => {
    const result = scoreToken(weakToken, {
      mintable: true,
      mutableMetadata: true,
      top10HolderPercent: 66,
      lpLockedPercent: 10,
      holder: 70,
      trustScore: 20,
    });

    expect(result.flags).toContain('Mintable supply');
    expect(result.flags).toContain('Concentrated whale ownership');
    expect(result.flags).toContain('Low locked liquidity');
  });
});
