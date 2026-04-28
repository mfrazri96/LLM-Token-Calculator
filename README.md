# LLM Token Calculator

A small client-side web app for estimating LLM text token usage and request cost. Users paste prompt text, choose an editable pricing preset, enter expected output tokens, and see input cost, output cost, and total estimated cost.

The app also includes an AI Benchmark tab for comparing the current top 15 model entries by intelligence, speed, blended token price, latency, and context window.

## Stack

- Vite
- React
- TypeScript
- Vitest for pure calculation tests

## Setup

Install dependencies first:

```bash
npm install
```

Run the app locally:

```bash
npm run dev
```

Build and test:

```bash
npm run build
npm test
```

## Calculator Assumptions

- Token counts are approximate and currently use a lightweight local heuristic.
- Prices are editable and should be checked against the provider's current published pricing.
- Output tokens are user-estimated because the final model response length is unknown before generation.
- Cost is calculated as `tokens * pricePerMillion / 1,000,000`.
- The app does not need API keys, a backend, or server-side storage.

## AI Benchmark Assumptions

- The benchmark snapshot is static client data in `src/data/aiBenchmarkModels.ts`.
- Current snapshot date: `2026-04-28`.
- Ranking source: [Artificial Analysis LLM Leaderboard](https://artificialanalysis.ai/leaderboards/models/).
- The top 15 are ranked by Artificial Analysis Intelligence Index model entries, so model variants such as reasoning effort levels can appear separately.
- Live benchmark, latency, speed, and price values should be refreshed before a release.

## Project Structure

```text
src/
  App.tsx
  components/
  data/
  lib/
  main.tsx
  types.ts
```

## Privacy

The starter app keeps the pasted prompt in local React state only. It does not send text to a server or persist prompt text by default.
