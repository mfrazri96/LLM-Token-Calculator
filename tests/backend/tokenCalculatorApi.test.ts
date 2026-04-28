import { describe, expect, it } from "vitest";
import {
  calculateTokenUsageForApi,
  getModelCatalog,
  handleModelOptionsRequest,
  handleTokenCalculationRequest
} from "../../src/api/tokenCalculator";

describe("token calculator API adapter", () => {
  it("returns a successful estimate for valid calculation requests", async () => {
    const response = await handleTokenCalculationRequest(
      new Request("https://local.test/api/token-calculation", {
        method: "POST",
        body: JSON.stringify({
          text: "Draft a changelog summary.",
          outputTokens: 300
        })
      })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(body.ok).toBe(true);
    expect(body.estimate.outputTokens).toBe(300);
    expect(body.estimate.text.estimatedInputTokens).toBeGreaterThan(0);
  });

  it("returns validation errors with a 400 status", async () => {
    const response = await handleTokenCalculationRequest(
      new Request("https://local.test/api/token-calculation", {
        method: "POST",
        body: JSON.stringify({
          text: "Invalid request",
          outputTokens: 1.5
        })
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.errors).toContainEqual({
      field: "outputTokens",
      message: "outputTokens must be a whole number."
    });
  });

  it("rejects invalid JSON request bodies", async () => {
    const response = await handleTokenCalculationRequest(
      new Request("https://local.test/api/token-calculation", {
        method: "POST",
        body: "{"
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.errors[0].field).toBe("request");
  });

  it("rejects JSON request bodies that are not objects", async () => {
    const response = await handleTokenCalculationRequest(
      new Request("https://local.test/api/token-calculation", {
        method: "POST",
        body: JSON.stringify(["not", "an", "object"])
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.errors).toContainEqual({
      field: "request",
      message: "Request body must be a JSON object."
    });
  });

  it("rejects unsupported methods for calculation", async () => {
    const response = await handleTokenCalculationRequest(
      new Request("https://local.test/api/token-calculation", {
        method: "GET"
      })
    );
    const body = await response.json();

    expect(response.status).toBe(405);
    expect(body.ok).toBe(false);
  });

  it("lists backend model pricing options", async () => {
    const response = handleModelOptionsRequest(
      new Request("https://local.test/api/model-options", {
        method: "GET"
      })
    );
    const body = await response.json();
    const providers = new Set(body.models.map((model: { provider: string }) => model.provider));

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.defaultModelId).toBe("gpt-5.5");
    expect(body.groups.map((group: { provider: string }) => group.provider)).toEqual([
      "OpenAI",
      "Anthropic",
      "NVIDIA",
      "Custom"
    ]);
    expect(body.models.length).toBeGreaterThanOrEqual(10);
    expect(body.models.map((model: { id: string }) => model.id)).toEqual(
      expect.arrayContaining([
        "gpt-5.5",
        "gpt-5.4-pro",
        "gpt-4.1",
        "claude-opus-4-7",
        "claude-opus-4-6",
        "claude-sonnet-4-6",
        "claude-haiku-3-5",
        "nvidia-nemotron-3-super-120b-a12b",
        "custom"
      ])
    );
    expect(providers.has("OpenAI")).toBe(true);
    expect(providers.has("Anthropic")).toBe(true);
    expect(providers.has("NVIDIA")).toBe(true);
    expect(providers.has("Google")).toBe(false);
    expect(providers.has("xAI")).toBe(false);
    expect(providers.has("Custom")).toBe(true);
    expect(body.models[0]).toEqual(
      expect.objectContaining({
        label: "OpenAI - GPT-5.5",
        detail: "1,000,000 context - $5/M input - $30/M output"
      })
    );
  });

  it("exposes the calculator service through the API module", () => {
    const result = calculateTokenUsageForApi({
      text: "Small prompt",
      modelId: "nvidia-nemotron-3-super-120b-a12b",
      outputTokens: 10
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.estimate.model.provider).toBe("NVIDIA");
    }
  });

  it("exposes the grouped model catalog through the API module", () => {
    const catalog = getModelCatalog();

    expect(catalog.groups.some((group) => group.provider === "Anthropic")).toBe(true);
    expect(catalog.models.some((model) => model.searchText.includes("claude"))).toBe(true);
  });
});
