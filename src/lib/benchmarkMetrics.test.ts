import { describe, expect, it } from "vitest";
import { aiBenchmarkModels } from "../data/aiBenchmarkModels";
import {
  filterBenchmarkModels,
  formatBenchmarkValue,
  getBenchmarkHighlights,
  getRankedBenchmarkModels,
  normaliseBenchmarkMetric
} from "./benchmarkMetrics";

describe("benchmarkMetrics", () => {
  it("keeps a ranked top-15 benchmark dataset", () => {
    const rankedModels = getRankedBenchmarkModels(aiBenchmarkModels);

    expect(rankedModels).toHaveLength(15);
    expect(rankedModels[0].rank).toBe(1);
    expect(rankedModels[14].rank).toBe(15);
    expect(new Set(rankedModels.map((model) => model.id)).size).toBe(15);
  });

  it("filters models by provider without changing benchmark rank order", () => {
    const openAiModels = filterBenchmarkModels(aiBenchmarkModels, "OpenAI");

    expect(openAiModels.map((model) => model.rank)).toEqual([1, 2, 5, 6, 9]);
  });

  it("formats missing benchmark values clearly", () => {
    expect(formatBenchmarkValue(null, "outputSpeedTokensPerSecond")).toBe("Not listed");
  });

  it("formats end-to-end response time", () => {
    expect(formatBenchmarkValue(77.04, "totalResponseSeconds")).toBe("77.04s");
  });

  it("formats context windows for comparison charts", () => {
    expect(formatBenchmarkValue(1_000_000, "contextWindowTokens")).toBe("1M");
  });

  it("normalises lower prices as stronger price value", () => {
    const cheapest = aiBenchmarkModels.find((model) => model.id === "mimo-v2-5-pro");
    const priciest = aiBenchmarkModels.find((model) => model.id === "gpt-5-5-xhigh");

    expect(cheapest).toBeDefined();
    expect(priciest).toBeDefined();
    expect(
      normaliseBenchmarkMetric(
        aiBenchmarkModels,
        cheapest!,
        "blendedPriceUsdPerMillion",
        true
      )
    ).toBeGreaterThan(
      normaliseBenchmarkMetric(
        aiBenchmarkModels,
        priciest!,
        "blendedPriceUsdPerMillion",
        true
      )
    );
  });

  it("finds benchmark highlights for intelligence, speed, price, and latency", () => {
    const highlights = getBenchmarkHighlights(aiBenchmarkModels);

    expect(highlights.map((highlight) => highlight.label)).toEqual([
      "Top intelligence",
      "Fastest output",
      "Lowest price",
      "Lowest latency"
    ]);
  });
});
