---
title: Fresh Radar
subtitle: Birdeye Sprint 1 draft submission
source_bounty: https://superteam.fun/earn/listing/birdeye-data-4-week-bip-competition-sprint-1/
tags:
  - birdeye
  - solana
  - token-discovery
  - vite
---

# Fresh Radar

Fresh Radar is a lightweight Solana launch radar for the Birdeye Data Sprint 1 bounty. It combines Birdeye's new listing feed with token security checks to surface newly launched tokens that look healthier on first pass.

## What it does

- Pulls recent Solana launches from `GET /defi/v2/tokens/new_listing`
- Enriches each token with `GET /defi/token_security`
- Scores listings using liquidity, volume, trust score, LP lock percentage, holder concentration, and mintability heuristics
- Renders a clean ranked dashboard that works in demo mode without secrets and switches to live mode when `VITE_BIRDEYE_API_KEY` is set

## Why this is useful

Birdeye's sprint prompt specifically calls out a "new token radar with safety scoring" as a buildable idea. This project turns that idea into a reviewable artifact with enough UX polish to demo quickly and enough scoring logic to show real product intent.

## Endpoints used

- `/defi/v2/tokens/new_listing`
- `/defi/token_security`

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

To build and test:

```bash
npm run test
npm run build
```

## Submission notes for Ben

- Repo link is ready for review.
- The final Superteam submission should mention the two endpoints above.
- If Ben wants stronger Sprint 1 positioning, the next increment is adding Birdeye websocket support for `SUBSCRIBE_TOKEN_NEW_LISTING` and a shareable watchlist URL.
