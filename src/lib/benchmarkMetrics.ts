import type { AiBenchmarkModel } from "../types";

export type BenchmarkMetricKey =
  | "intelligenceScore"
  | "outputSpeedTokensPerSecond"
  | "blendedPriceUsdPerMillion"
  | "latencySeconds"
  | "totalResponseSeconds"
  | "contextWindowTokens";

export type BenchmarkHighlight = {
  label: string;
  model: AiBenchmarkModel;
  value: string;
  detail: string;
};

const metricFormatters: Record<BenchmarkMetricKey, (value: number) => string> = {
  intelligenceScore: (value) => value.toFixed(0),
  outputSpeedTokensPerSecond: (value) => `${Math.round(value)} tok/s`,
  blendedPriceUsdPerMillion: (value) => `$${value.toFixed(2)}/M`,
  latencySeconds: (value) => `${value.toFixed(2)}s`,
  totalResponseSeconds: (value) => `${value.toFixed(2)}s`,
  contextWindowTokens: (value) => formatContextWindow(value)
};

export function getRankedBenchmarkModels(
  models: AiBenchmarkModel[],
  limit = models.length
): AiBenchmarkModel[] {
  return [...models].sort((a, b) => a.rank - b.rank).slice(0, limit);
}

export function getBenchmarkProviders(models: AiBenchmarkModel[]): string[] {
  return [...new Set(models.map((model) => model.provider))].sort((a, b) => a.localeCompare(b));
}

export function filterBenchmarkModels(models: AiBenchmarkModel[], provider: string): AiBenchmarkModel[] {
  return provider === "All"
    ? getRankedBenchmarkModels(models)
    : getRankedBenchmarkModels(models).filter((model) => model.provider === provider);
}

export function formatBenchmarkValue(
  value: number | null,
  metric: BenchmarkMetricKey
): string {
  return value === null ? "Not listed" : metricFormatters[metric](value);
}

export function formatContextWindow(tokens: number): string {
  if (tokens >= 1_000_000) {
    return `${trimTrailingZeros((tokens / 1_000_000).toFixed(2))}M`;
  }

  if (tokens >= 1_000) {
    return `${trimTrailingZeros((tokens / 1_000).toFixed(1))}k`;
  }

  return tokens.toLocaleString();
}

export function normaliseBenchmarkMetric(
  models: AiBenchmarkModel[],
  model: AiBenchmarkModel,
  metric: BenchmarkMetricKey,
  lowerIsBetter = false
): number {
  const value = model[metric];

  if (value === null) {
    return 0;
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

export function getBenchmarkHighlights(models: AiBenchmarkModel[]): BenchmarkHighlight[] {
  return [
    {
      label: "Top intelligence",
      model: getBestModel(models, "intelligenceScore", "max"),
      value: formatBenchmarkValue(getBestModel(models, "intelligenceScore", "max").intelligenceScore, "intelligenceScore"),
      detail: "Artificial Analysis Intelligence Index"
    },
    {
      label: "Fastest output",
      model: getBestModel(models, "outputSpeedTokensPerSecond", "max"),
      value: formatBenchmarkValue(
        getBestModel(models, "outputSpeedTokensPerSecond", "max").outputSpeedTokensPerSecond,
        "outputSpeedTokensPerSecond"
      ),
      detail: "Median tokens per second"
    },
    {
      label: "Lowest price",
      model: getBestModel(models, "blendedPriceUsdPerMillion", "min"),
      value: formatBenchmarkValue(
        getBestModel(models, "blendedPriceUsdPerMillion", "min").blendedPriceUsdPerMillion,
        "blendedPriceUsdPerMillion"
      ),
      detail: "Blended USD per 1M tokens"
    },
    {
      label: "Lowest latency",
      model: getBestModel(models, "latencySeconds", "min"),
      value: formatBenchmarkValue(getBestModel(models, "latencySeconds", "min").latencySeconds, "latencySeconds"),
      detail: "Time to first chunk"
    }
  ];
}

function getBestModel(
  models: AiBenchmarkModel[],
  metric: BenchmarkMetricKey,
  direction: "min" | "max"
): AiBenchmarkModel {
  const candidates = models.filter((model) => model[metric] !== null);
  const [firstCandidate] = candidates;

  if (!firstCandidate) {
    throw new Error(`No benchmark models include ${metric}.`);
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

function trimTrailingZeros(value: string): string {
  return value.replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
}
