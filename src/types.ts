export type ModelPreset = {
  id: string;
  name: string;
  provider: string;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  contextWindow: number;
  note?: string;
};

export type CostInput = {
  inputTokens: number;
  outputTokens: number;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
};

export type CostBreakdown = {
  inputCost: number;
  outputCost: number;
  totalCost: number;
};

export type TextTokenSummary = {
  characters: number;
  words: number;
  estimatedTokens: number;
};

export type AiBenchmarkModel = {
  id: string;
  rank: number;
  name: string;
  provider: string;
  contextWindowTokens: number;
  intelligenceScore: number;
  blendedPriceUsdPerMillion: number | null;
  outputSpeedTokensPerSecond: number | null;
  latencySeconds: number | null;
  totalResponseSeconds: number | null;
  strengths: string[];
};

export type BenchmarkMetadata = {
  collectedAt: string;
  sourceName: string;
  sourceUrl: string;
  rankingBasis: string;
  note: string;
};
