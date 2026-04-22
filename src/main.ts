import './style.css';
import { fetchNewListings, fetchSecurityMap } from './lib/birdeye';
import { rankTokens } from './lib/scoring';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Missing #app container');
}

const apiKey = import.meta.env.VITE_BIRDEYE_API_KEY ?? '';

app.innerHTML = `
  <div class="shell">
    <header class="hero">
      <p class="eyebrow">Birdeye Sprint 1 Draft</p>
      <h1>Fresh Radar</h1>
      <p class="lede">A lightweight Solana token radar that combines Birdeye new listings with security heuristics so new launches are easier to triage.</p>
      <div class="meta">
        <span>${apiKey ? 'Live mode with Birdeye API' : 'Demo mode with sample data'}</span>
        <span>Endpoints: /defi/v2/tokens/new_listing + /defi/token_security</span>
      </div>
    </header>
    <main>
      <section class="panel">
        <div class="panel-head">
          <h2>Ranked launches</h2>
          <p>Higher score means stronger liquidity, broader holder distribution, and fewer obvious risk flags.</p>
        </div>
        <div id="status" class="status">Loading radar…</div>
        <div id="cards" class="cards"></div>
      </section>
    </main>
  </div>
`;

const statusNode = document.querySelector<HTMLDivElement>('#status');
const cardsNode = document.querySelector<HTMLDivElement>('#cards');

async function load() {
  try {
    const listings = await fetchNewListings(apiKey);
    const securityMap = await fetchSecurityMap(apiKey, listings.map((token) => token.address));
    const ranked = rankTokens(listings, securityMap);

    if (statusNode) {
      statusNode.textContent = `${ranked.length} listings processed`;
    }

    if (cardsNode) {
      cardsNode.innerHTML = ranked.map((entry, index) => `
        <article class="card">
          <div class="card-top">
            <div>
              <p class="rank">#${index + 1}</p>
              <h3>${entry.token.symbol ?? 'UNKNOWN'} <span>${entry.token.name ?? ''}</span></h3>
            </div>
            <div class="score">${entry.score}</div>
          </div>
          <dl class="stats">
            <div><dt>Liquidity</dt><dd>$${Math.round(entry.token.liquidity ?? 0).toLocaleString()}</dd></div>
            <div><dt>24h volume</dt><dd>$${Math.round(entry.token.volume24h ?? 0).toLocaleString()}</dd></div>
            <div><dt>Top 10 holders</dt><dd>${entry.security?.top10HolderPercent ?? 'n/a'}%</dd></div>
            <div><dt>LP locked</dt><dd>${entry.security?.lpLockedPercent ?? 'n/a'}%</dd></div>
          </dl>
          <ul class="flags">
            ${entry.flags.map((flag) => `<li>${flag}</li>`).join('')}
          </ul>
          <p class="address">${entry.token.address}</p>
        </article>
      `).join('');
    }
  } catch (error) {
    if (statusNode) {
      statusNode.textContent = error instanceof Error ? error.message : 'Unknown error';
    }
  }
}

void load();
