import { describe, expect, it } from "vitest";
import {
  getAiBenchmarkForApi,
  getAiBenchmarkMetadata,
  getAiBenchmarkProviders,
  handleAiBenchmarkRequest
} from "../../src/api/aiBenchmark";

describe("AI benchmark API adapter", () => {
  it("returns the default AI benchmark snapshot", async () => {
    const response = handleAiBenchmarkRequest(
      new Request("https://local.test/api/ai-benchmark", {
        method: "GET"
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(body.ok).toBe(true);
    expect(body.metadata.collectedAt).toBe("2026-04-28");
    expect(body.updatedDateLabel).toBe("April 28, 2026");
    expect(body.models).toHaveLength(15);
    expect(body.models[0]).toEqual(
      expect.objectContaining({
        id: "gpt-5-5-xhigh",
        rank: 1,
        scorecard: expect.objectContaining({
          intelligence: 100
        })
      })
    );
    expect(body.highlights).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          metric: "intelligence",
          model: expect.objectContaining({ id: "gpt-5-5-xhigh" })
        })
      ])
    );
  });

  it("supports provider and limit query parameters", async () => {
    const response = handleAiBenchmarkRequest(
      new Request("https://local.test/api/ai-benchmark?provider=Anthropic&limit=2", {
        method: "GET"
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.selectedProvider).toBe("Anthropic");
    expect(body.models.map((model: { id: string }) => model.id)).toEqual([
      "claude-opus-4-7-max",
      "claude-opus-4-6-max"
    ]);
  });

  it("returns validation errors with a 400 status", async () => {
    const response = handleAiBenchmarkRequest(
      new Request("https://local.test/api/ai-benchmark?provider=xAI&limit=0", {
        method: "GET"
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.errors).toEqual([
      {
        field: "provider",
        message: 'Unsupported benchmark provider "xAI".'
      },
      {
        field: "limit",
        message: "Limit must be between 1 and 15."
      }
    ]);
  });

  it("rejects unsupported methods", async () => {
    const response = handleAiBenchmarkRequest(
      new Request("https://local.test/api/ai-benchmark", {
        method: "POST"
      })
    );
    const body = await response.json();

    expect(response.status).toBe(405);
    expect(body.ok).toBe(false);
    expect(body.errors).toContainEqual({
      field: "request",
      message: "Use GET to list AI benchmark models."
    });
  });

  it("exposes benchmark helpers through the API module", () => {
    const result = getAiBenchmarkForApi({
      provider: "Google"
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.benchmark.models).toHaveLength(1);
      expect(result.benchmark.models[0].id).toBe("gemini-3-1-pro-preview");
    }
    expect(getAiBenchmarkMetadata().sourceUrl).toBe("https://artificialanalysis.ai/leaderboards/models/");
    expect(getAiBenchmarkProviders()).toContain("OpenAI");
  });
});
