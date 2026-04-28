import { describe, expect, it } from "vitest";
import {
  AI_BENCHMARK_MODEL_LIMIT,
  getAiBenchmarkMetadata,
  getAiBenchmarkModels,
  getAiBenchmarkProviders,
  getAiBenchmarkSnapshot,
  type AiBenchmarkResponse
} from "../../src/server/aiBenchmarkService";

function unwrapBenchmark(response: AiBenchmarkResponse): Extract<AiBenchmarkResponse, { ok: true }>["benchmark"] {
  if (response.ok) {
    return response.benchmark;
  }

  throw new Error(JSON.stringify(response.errors));
}

function unwrapErrors(response: AiBenchmarkResponse): Extract<AiBenchmarkResponse, { ok: false }>["errors"] {
  if (!response.ok) {
    return response.errors;
  }

  throw new Error("Expected benchmark validation errors.");
}

describe("getAiBenchmarkSnapshot", () => {
  it("returns the collected AI benchmark models in rank order", () => {
    const benchmark = unwrapBenchmark(getAiBenchmarkSnapshot());

    expect(benchmark.metadata).toEqual(
      expect.objectContaining({
        collectedAt: "2026-04-28",
        sourceName: "Artificial Analysis Intelligence Index",
        sourceUrl: "https://artificialanalysis.ai/leaderboards/models/"
      })
    );
    expect(benchmark.updatedDateLabel).toBe("April 28, 2026");
    expect(benchmark.totalModels).toBe(AI_BENCHMARK_MODEL_LIMIT);
    expect(benchmark.models).toHaveLength(AI_BENCHMARK_MODEL_LIMIT);
    expect(benchmark.models.map((model) => model.rank)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
    ]);
    expect(benchmark.models[0]).toEqual(
      expect.objectContaining({
        id: "gpt-5-5-xhigh",
        name: "GPT-5.5 (xhigh)",
        provider: "OpenAI",
        intelligenceScore: 60.2,
        outputSpeedTokensPerSecond: 84.2,
        blendedPriceUsdPerMillion: 11.25
      })
    );
    expect(benchmark.models[9]).toEqual(
      expect.objectContaining({
        id: "claude-opus-4-6-max",
        rank: 10
      })
    );
    expect(benchmark.models[14]).toEqual(
      expect.objectContaining({
        id: "deepseek-v4-pro-max",
        rank: 15
      })
    );
    expect(benchmark.models[15]).toEqual(
      expect.objectContaining({
        id: "nvidia-nemotron-3-super-120b-a12b",
        rank: 16,
        provider: "NVIDIA",
        intelligenceScore: 36,
        outputSpeedTokensPerSecond: 156.8,
        blendedPriceUsdPerMillion: 0.4125
      })
    );
    expect(benchmark.models.some((model) => model.id === "glm-5-1")).toBe(false);
  });

  it("keeps model IDs unique and exposes provider filters", () => {
    const models = getAiBenchmarkModels();
    const ids = models.map((model) => model.id);
    const metadata = getAiBenchmarkMetadata();
    const strengthLabels = models.flatMap((model) => model.strengths);

    expect(new Set(ids).size).toBe(ids.length);
    expect(getAiBenchmarkProviders()).toEqual([
      "Alibaba",
      "Anthropic",
      "DeepSeek",
      "Google",
      "Kimi",
      "Meta",
      "NVIDIA",
      "OpenAI",
      "Xiaomi"
    ]);
    expect(metadata.rankingBasis).toContain("Top 16");
    expect(metadata.rankingBasis).toContain("NVIDIA Nemotron");
    expect(metadata.rankingBasis).not.toContain("Top 15");
    expect(strengthLabels).toEqual(expect.arrayContaining(["Fastest output in top 16", "Top 16 intelligence"]));
    expect(strengthLabels.some((strength) => strength.includes("Top 15") || strength.includes("top 15"))).toBe(false);
  });

  it("adds normalized scorecards and highlights for chart-ready comparisons", () => {
    const benchmark = unwrapBenchmark(getAiBenchmarkSnapshot());
    const nvidia = benchmark.models.find((model) => model.id === "nvidia-nemotron-3-super-120b-a12b");
    const largestContext = benchmark.models.find((model) => model.id === "gpt-5-4-xhigh");

    expect(benchmark.models[0].scorecard.intelligence).toBe(100);
    expect(nvidia?.scorecard.outputSpeed).toBe(100);
    expect(nvidia?.scorecard.priceEfficiency).toBe(100);
    expect(largestContext?.scorecard.contextWindow).toBe(100);
    expect(benchmark.highlights).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metric: "intelligence",
          model: expect.objectContaining({ id: "gpt-5-5-xhigh" }),
          value: "60.2"
        }),
        expect.objectContaining({
          metric: "outputSpeed",
          model: expect.objectContaining({ id: "nvidia-nemotron-3-super-120b-a12b" }),
          value: "156.8 tok/s"
        }),
        expect.objectContaining({
          metric: "price",
          model: expect.objectContaining({ id: "nvidia-nemotron-3-super-120b-a12b" }),
          value: "$0.41/M"
        })
      ])
    );
  });

  it("filters by provider and applies a safe limit", () => {
    const benchmark = unwrapBenchmark(
      getAiBenchmarkSnapshot({
        provider: "OpenAI",
        limit: "3"
      })
    );

    expect(benchmark.selectedProvider).toBe("OpenAI");
    expect(benchmark.models.map((model) => model.id)).toEqual(["gpt-5-5-xhigh", "gpt-5-5-high", "gpt-5-4-xhigh"]);
    expect(benchmark.highlights).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metric: "outputSpeed",
          model: expect.objectContaining({ id: "gpt-5-4-xhigh" })
        })
      ])
    );
  });

  it("filters the added NVIDIA benchmark model independently", () => {
    const benchmark = unwrapBenchmark(
      getAiBenchmarkSnapshot({
        provider: "NVIDIA"
      })
    );

    expect(benchmark.selectedProvider).toBe("NVIDIA");
    expect(benchmark.models).toHaveLength(1);
    expect(benchmark.models[0]).toEqual(
      expect.objectContaining({
        id: "nvidia-nemotron-3-super-120b-a12b",
        provider: "NVIDIA",
        contextWindowTokens: 1_000_000
      })
    );
    expect(benchmark.highlights.map((highlight) => highlight.metric)).toEqual([
      "intelligence",
      "outputSpeed",
      "price",
      "context"
    ]);
  });

  it("handles providers with unlisted speed and price metrics without failing", () => {
    const benchmark = unwrapBenchmark(
      getAiBenchmarkSnapshot({
        provider: "Meta"
      })
    );

    expect(benchmark.models).toHaveLength(1);
    expect(benchmark.models[0].id).toBe("muse-spark");
    expect(benchmark.models[0].scorecard.outputSpeed).toBeNull();
    expect(benchmark.models[0].scorecard.priceEfficiency).toBeNull();
    expect(benchmark.highlights.map((highlight) => highlight.metric)).toEqual(["intelligence", "context"]);
  });

  it("returns validation errors for unsupported providers and unsafe limits", () => {
    const errors = unwrapErrors(
      getAiBenchmarkSnapshot({
        provider: "Missing Lab",
        limit: 17
      })
    );

    expect(errors).toEqual([
      {
        field: "provider",
        message: 'Unsupported benchmark provider "Missing Lab".'
      },
      {
        field: "limit",
        message: "Limit must be between 1 and 16."
      }
    ]);
  });
});
