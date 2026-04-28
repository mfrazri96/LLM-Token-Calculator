import type { AiBenchmarkModel, BenchmarkMetadata } from "../types";

export const AI_BENCHMARK_MODEL_LIMIT = 16;

export type AiBenchmarkRequest = {
  provider?: unknown;
  limit?: unknown;
};

export type AiBenchmarkValidationField = keyof AiBenchmarkRequest | "request";

export type AiBenchmarkValidationError = {
  field: AiBenchmarkValidationField;
  message: string;
};

export type AiBenchmarkScorecard = {
  intelligence: number;
  outputSpeed: number | null;
  priceEfficiency: number | null;
  contextWindow: number;
};

export type AiBenchmarkComparisonModel = AiBenchmarkModel & {
  scorecard: AiBenchmarkScorecard;
};

export type AiBenchmarkHighlightMetric = "intelligence" | "outputSpeed" | "price" | "context";

export type AiBenchmarkHighlight = {
  metric: AiBenchmarkHighlightMetric;
  label: string;
  model: Pick<AiBenchmarkModel, "id" | "name" | "provider" | "rank">;
  value: string;
};

export type AiBenchmarkSnapshot = {
  metadata: BenchmarkMetadata;
  updatedDateLabel: string;
  providers: string[];
  selectedProvider: string;
  totalModels: number;
  models: AiBenchmarkComparisonModel[];
  highlights: AiBenchmarkHighlight[];
};

export type AiBenchmarkResponse =
  | {
      ok: true;
      benchmark: AiBenchmarkSnapshot;
    }
  | {
      ok: false;
      errors: AiBenchmarkValidationError[];
    };

const benchmarkMetadata: BenchmarkMetadata = {
  collectedAt: "2026-04-28",
  sourceName: "Artificial Analysis Intelligence Index",
  sourceUrl: "https://artificialanalysis.ai/leaderboards/models/",
  rankingBasis:
    "Top 16 current model entries by Artificial Analysis Intelligence Index, including NVIDIA Nemotron 3 Super 120B A12B; ranking values cross-checked against the Easy Benchmarks snapshot.",
  note:
    "Artificial Analysis speed metrics are live and based on recent measurements, so refresh this static snapshot before each release."
};

const benchmarkModels: AiBenchmarkModel[] = [
  {
    id: "gpt-5-5-xhigh",
    rank: 1,
    name: "GPT-5.5 (xhigh)",
    provider: "OpenAI",
    contextWindowTokens: 922_000,
    intelligenceScore: 60.2,
    blendedPriceUsdPerMillion: 11.25,
    outputSpeedTokensPerSecond: 84.2,
    latencySeconds: null,
    totalResponseSeconds: null,
    strengths: ["Current intelligence leader", "Large context", "Reasoning-heavy work"]
  },
  {
    id: "gpt-5-5-high",
    rank: 2,
    name: "GPT-5.5 (high)",
    provider: "OpenAI",
    contextWindowTokens: 922_000,
    intelligenceScore: 58.9,
    blendedPriceUsdPerMillion: 11.25,
    outputSpeedTokensPerSecond: 75.9,
    latencySeconds: null,
    totalResponseSeconds: null,
    strengths: ["Top-tier reasoning", "Large context", "Balanced frontier option"]
  },
  {
    id: "claude-opus-4-7-max",
    rank: 3,
    name: "Claude Opus 4.7 (Adaptive Reasoning, Max Effort)",
    provider: "Anthropic",
    contextWindowTokens: 1_000_000,
    intelligenceScore: 57.3,
    blendedPriceUsdPerMillion: 10,
    outputSpeedTokensPerSecond: 59.1,
    latencySeconds: null,
    totalResponseSeconds: null,
    strengths: ["Long context", "Complex knowledge work", "Premium reasoning"]
  },
  {
    id: "gemini-3-1-pro-preview",
    rank: 4,
    name: "Gemini 3.1 Pro Preview",
    provider: "Google",
    contextWindowTokens: 1_000_000,
    intelligenceScore: 57.2,
    blendedPriceUsdPerMillion: 4.5,
    outputSpeedTokensPerSecond: 132.1,
    latencySeconds: null,
    totalResponseSeconds: null,
    strengths: ["High output speed", "Strong value", "Long context"]
  },
  {
    id: "gpt-5-4-xhigh",
    rank: 5,
    name: "GPT-5.4 (xhigh)",
    provider: "OpenAI",
    contextWindowTokens: 1_050_000,
    intelligenceScore: 56.8,
    blendedPriceUsdPerMillion: 5.63,
    outputSpeedTokensPerSecond: 85.3,
    latencySeconds: null,
    totalResponseSeconds: null,
    strengths: ["High intelligence", "Largest context in top five", "Reasoning-heavy work"]
  },
  {
    id: "gpt-5-5-medium",
    rank: 6,
    name: "GPT-5.5 (medium)",
    provider: "OpenAI",
    contextWindowTokens: 922_000,
    intelligenceScore: 56.7,
    blendedPriceUsdPerMillion: 11.25,
    outputSpeedTokensPerSecond: 80.4,
    latencySeconds: null,
    totalResponseSeconds: null,
    strengths: ["Top intelligence tier", "Interactive workflows", "Lower effort variant"]
  },
  {
    id: "kimi-k2-6",
    rank: 7,
    name: "Kimi K2.6",
    provider: "Kimi",
    contextWindowTokens: 256_000,
    intelligenceScore: 53.9,
    blendedPriceUsdPerMillion: 1.71,
    outputSpeedTokensPerSecond: 138.4,
    latencySeconds: null,
    totalResponseSeconds: null,
    strengths: ["Fastest output in top 16", "Lower blended price", "Mid-size context"]
  },
  {
    id: "mimo-v2-5-pro",
    rank: 8,
    name: "MiMo-V2.5-Pro",
    provider: "Xiaomi",
    contextWindowTokens: 1_000_000,
    intelligenceScore: 53.8,
    blendedPriceUsdPerMillion: 1.5,
    outputSpeedTokensPerSecond: 65.9,
    latencySeconds: null,
    totalResponseSeconds: null,
    strengths: ["Lowest listed price in top 16", "Long context", "Strong value"]
  },
  {
    id: "gpt-5-3-codex-xhigh",
    rank: 9,
    name: "GPT-5.3 Codex (xhigh)",
    provider: "OpenAI",
    contextWindowTokens: 400_000,
    intelligenceScore: 53.6,
    blendedPriceUsdPerMillion: 4.81,
    outputSpeedTokensPerSecond: 89.4,
    latencySeconds: null,
    totalResponseSeconds: null,
    strengths: ["Coding focus", "Solid output speed", "High intelligence"]
  },
  {
    id: "claude-opus-4-6-max",
    rank: 10,
    name: "Claude Opus 4.6 (Adaptive Reasoning, Max Effort)",
    provider: "Anthropic",
    contextWindowTokens: 1_000_000,
    intelligenceScore: 53,
    blendedPriceUsdPerMillion: 10,
    outputSpeedTokensPerSecond: 53.7,
    latencySeconds: null,
    totalResponseSeconds: null,
    strengths: ["Long context", "Premium reasoning", "Strong knowledge work"]
  },
  {
    id: "muse-spark",
    rank: 11,
    name: "Muse Spark",
    provider: "Meta",
    contextWindowTokens: 262_000,
    intelligenceScore: 52.1,
    blendedPriceUsdPerMillion: null,
    outputSpeedTokensPerSecond: null,
    latencySeconds: null,
    totalResponseSeconds: null,
    strengths: ["Top 16 intelligence", "Mid-size context", "Emerging benchmark entry"]
  },
  {
    id: "claude-opus-4-7-non-reasoning-high",
    rank: 12,
    name: "Claude Opus 4.7 (Non-reasoning, High Effort)",
    provider: "Anthropic",
    contextWindowTokens: 1_000_000,
    intelligenceScore: 51.8,
    blendedPriceUsdPerMillion: 10,
    outputSpeedTokensPerSecond: 51.1,
    latencySeconds: null,
    totalResponseSeconds: null,
    strengths: ["Long context", "Premium quality", "Non-reasoning variant"]
  },
  {
    id: "qwen3-6-max-preview",
    rank: 13,
    name: "Qwen3.6 Max Preview",
    provider: "Alibaba",
    contextWindowTokens: 256_000,
    intelligenceScore: 51.8,
    blendedPriceUsdPerMillion: 2.93,
    outputSpeedTokensPerSecond: 34.1,
    latencySeconds: null,
    totalResponseSeconds: null,
    strengths: ["Strong value", "Preview frontier model", "Top 16 intelligence"]
  },
  {
    id: "claude-sonnet-4-6-max",
    rank: 14,
    name: "Claude Sonnet 4.6 (Adaptive Reasoning, Max Effort)",
    provider: "Anthropic",
    contextWindowTokens: 1_000_000,
    intelligenceScore: 51.7,
    blendedPriceUsdPerMillion: 6,
    outputSpeedTokensPerSecond: 68.6,
    latencySeconds: null,
    totalResponseSeconds: null,
    strengths: ["Long context", "Balanced intelligence", "Enterprise workflows"]
  },
  {
    id: "deepseek-v4-pro-max",
    rank: 15,
    name: "DeepSeek V4 Pro (Reasoning, Max Effort)",
    provider: "DeepSeek",
    contextWindowTokens: 1_000_000,
    intelligenceScore: 51.5,
    blendedPriceUsdPerMillion: 2.18,
    outputSpeedTokensPerSecond: 38.3,
    latencySeconds: null,
    totalResponseSeconds: null,
    strengths: ["Strong value", "Long context", "Top 16 intelligence"]
  },
  {
    id: "nvidia-nemotron-3-super-120b-a12b",
    rank: 16,
    name: "NVIDIA Nemotron 3 Super 120B A12B (Reasoning)",
    provider: "NVIDIA",
    contextWindowTokens: 1_000_000,
    intelligenceScore: 36,
    blendedPriceUsdPerMillion: 0.4125,
    outputSpeedTokensPerSecond: 156.8,
    latencySeconds: 1.05,
    totalResponseSeconds: null,
    strengths: ["NVIDIA open weights", "Fast output", "1M context"]
  }
];

type NumericMetric = keyof Pick<
  AiBenchmarkModel,
  "intelligenceScore" | "outputSpeedTokensPerSecond" | "blendedPriceUsdPerMillion" | "contextWindowTokens"
>;

function copyModel(model: AiBenchmarkModel): AiBenchmarkModel {
  return {
    ...model,
    strengths: [...model.strengths]
  };
}

function rankedBenchmarkModels(): AiBenchmarkModel[] {
  return benchmarkModels
    .map(copyModel)
    .sort((left, right) => left.rank - right.rank)
    .slice(0, AI_BENCHMARK_MODEL_LIMIT);
}

function parseProvider(value: unknown, errors: AiBenchmarkValidationError[]): string {
  if (value === undefined || value === null || value === "") {
    return "All";
  }

  if (typeof value !== "string") {
    errors.push({
      field: "provider",
      message: "Provider must be a string."
    });
    return "All";
  }

  const provider = value.trim();
  if (!provider) {
    return "All";
  }

  const providers = getAiBenchmarkProviders();
  if (provider !== "All" && !providers.includes(provider)) {
    errors.push({
      field: "provider",
      message: `Unsupported benchmark provider "${provider}".`
    });
  }

  return provider;
}

function parseLimit(value: unknown, errors: AiBenchmarkValidationError[]): number {
  if (value === undefined || value === null || value === "") {
    return AI_BENCHMARK_MODEL_LIMIT;
  }

  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value.trim()) : NaN;

  if (!Number.isFinite(parsed)) {
    errors.push({
      field: "limit",
      message: "Limit must be a finite number."
    });
    return AI_BENCHMARK_MODEL_LIMIT;
  }

  if (!Number.isInteger(parsed)) {
    errors.push({
      field: "limit",
      message: "Limit must be a whole number."
    });
    return AI_BENCHMARK_MODEL_LIMIT;
  }

  if (parsed < 1 || parsed > AI_BENCHMARK_MODEL_LIMIT) {
    errors.push({
      field: "limit",
      message: `Limit must be between 1 and ${AI_BENCHMARK_MODEL_LIMIT}.`
    });
    return AI_BENCHMARK_MODEL_LIMIT;
  }

  return parsed;
}

function filterByProvider(models: AiBenchmarkModel[], provider: string): AiBenchmarkModel[] {
  return provider === "All" ? models : models.filter((model) => model.provider === provider);
}

function normalizeMetric(
  models: AiBenchmarkModel[],
  model: AiBenchmarkModel,
  metric: NumericMetric,
  lowerIsBetter = false
): number | null {
  const value = model[metric];

  if (value === null) {
    return null;
  }

  const values = models
    .map((candidate) => candidate[metric])
    .filter((candidateValue): candidateValue is number => candidateValue !== null);
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return 100;
  }

  const ratio = lowerIsBetter ? (max - value) / (max - min) : (value - min) / (max - min);
  return Math.max(0, Math.min(100, Math.round(ratio * 100)));
}

function withScorecards(models: AiBenchmarkModel[]): AiBenchmarkComparisonModel[] {
  const rankedModels = rankedBenchmarkModels();

  return models.map((model) => ({
    ...copyModel(model),
    scorecard: {
      intelligence: normalizeMetric(rankedModels, model, "intelligenceScore") ?? 0,
      outputSpeed: normalizeMetric(rankedModels, model, "outputSpeedTokensPerSecond"),
      priceEfficiency: normalizeMetric(rankedModels, model, "blendedPriceUsdPerMillion", true),
      contextWindow: normalizeMetric(rankedModels, model, "contextWindowTokens") ?? 0
    }
  }));
}

function getBestModel(
  models: AiBenchmarkModel[],
  metric: NumericMetric,
  direction: "min" | "max"
): AiBenchmarkModel | null {
  const candidates = models.filter((model) => model[metric] !== null);
  const [firstCandidate] = candidates;

  if (!firstCandidate) {
    return null;
  }

  return candidates.reduce((best, candidate) => {
    const bestValue = best[metric] as number;
    const candidateValue = candidate[metric] as number;
    return direction === "min"
      ? candidateValue < bestValue
        ? candidate
        : best
      : candidateValue > bestValue
        ? candidate
        : best;
  }, firstCandidate);
}

function highlightModel(model: AiBenchmarkModel): AiBenchmarkHighlight["model"] {
  return {
    id: model.id,
    name: model.name,
    provider: model.provider,
    rank: model.rank
  };
}

function formatBenchmarkNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(value);
}

function formatPrice(value: number): string {
  return `$${formatBenchmarkNumber(value)}/M`;
}

function formatContext(tokens: number): string {
  if (tokens >= 1_000_000) {
    return `${formatBenchmarkNumber(tokens / 1_000_000)}M tokens`;
  }

  if (tokens >= 1_000) {
    return `${formatBenchmarkNumber(tokens / 1_000)}k tokens`;
  }

  return `${tokens.toLocaleString("en-US")} tokens`;
}

function formatCollectedDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00.000Z`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(parsed);
}

function getHighlights(models: AiBenchmarkModel[]): AiBenchmarkHighlight[] {
  const topIntelligence = getBestModel(models, "intelligenceScore", "max");
  const fastestOutput = getBestModel(models, "outputSpeedTokensPerSecond", "max");
  const lowestPrice = getBestModel(models, "blendedPriceUsdPerMillion", "min");
  const largestContext = getBestModel(models, "contextWindowTokens", "max");

  return [
    topIntelligence && {
      metric: "intelligence",
      label: "Top intelligence",
      model: highlightModel(topIntelligence),
      value: formatBenchmarkNumber(topIntelligence.intelligenceScore)
    },
    fastestOutput && {
      metric: "outputSpeed",
      label: "Fastest output",
      model: highlightModel(fastestOutput),
      value: `${formatBenchmarkNumber(fastestOutput.outputSpeedTokensPerSecond as number)} tok/s`
    },
    lowestPrice && {
      metric: "price",
      label: "Lowest listed price",
      model: highlightModel(lowestPrice),
      value: formatPrice(lowestPrice.blendedPriceUsdPerMillion as number)
    },
    largestContext && {
      metric: "context",
      label: "Largest context",
      model: highlightModel(largestContext),
      value: formatContext(largestContext.contextWindowTokens)
    }
  ].filter((highlight): highlight is AiBenchmarkHighlight => Boolean(highlight));
}

export function getAiBenchmarkProviders(): string[] {
  return [...new Set(rankedBenchmarkModels().map((model) => model.provider))].sort((left, right) =>
    left.localeCompare(right)
  );
}

export function getAiBenchmarkMetadata(): BenchmarkMetadata {
  return { ...benchmarkMetadata };
}

export function getAiBenchmarkModels(): AiBenchmarkModel[] {
  return rankedBenchmarkModels();
}

export function getAiBenchmarkSnapshot(request: AiBenchmarkRequest = {}): AiBenchmarkResponse {
  const errors: AiBenchmarkValidationError[] = [];
  const provider = parseProvider(request.provider, errors);
  const limit = parseLimit(request.limit, errors);

  if (errors.length > 0) {
    return {
      ok: false,
      errors
    };
  }

  const rankedModels = rankedBenchmarkModels();
  const filteredModels = filterByProvider(rankedModels, provider).slice(0, limit);

  return {
    ok: true,
    benchmark: {
      metadata: getAiBenchmarkMetadata(),
      updatedDateLabel: formatCollectedDate(benchmarkMetadata.collectedAt),
      providers: getAiBenchmarkProviders(),
      selectedProvider: provider,
      totalModels: rankedModels.length,
      models: withScorecards(filteredModels),
      highlights: getHighlights(filteredModels)
    }
  };
}
