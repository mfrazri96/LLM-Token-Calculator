import { describe, expect, it } from "vitest";
import {
  MAX_TEXT_CHARACTERS,
  calculateTokenUsage,
  getModelCatalog,
  getModelOptions,
  type TokenCalculatorEstimate,
  type TokenCalculatorResponse
} from "../../src/server/tokenCalculatorService";

function isErrorResponse(
  response: TokenCalculatorResponse
): response is Extract<TokenCalculatorResponse, { ok: false }> {
  return response.ok === false;
}

function unwrapEstimate(response: TokenCalculatorResponse): TokenCalculatorEstimate {
  if (!isErrorResponse(response)) {
    return response.estimate;
  }

  throw new Error(JSON.stringify(response.errors));
}

function unwrapErrors(
  response: TokenCalculatorResponse
): Extract<TokenCalculatorResponse, { ok: false }>["errors"] {
  if (isErrorResponse(response)) {
    return response.errors;
  }

  throw new Error("Expected validation errors.");
}

describe("getModelOptions", () => {
  it("lists expanded OpenAI and Claude pricing presets", () => {
    const models = getModelOptions();

    expect(models).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "gpt-5.5",
          provider: "OpenAI",
          inputPricePerMillion: 5,
          outputPricePerMillion: 30,
          contextWindow: 1_000_000
        }),
        expect.objectContaining({
          id: "gpt-5.4-pro",
          provider: "OpenAI",
          inputPricePerMillion: 30,
          outputPricePerMillion: 180,
          contextWindow: 1_000_000
        }),
        expect.objectContaining({
          id: "gpt-5.4-mini",
          provider: "OpenAI",
          inputPricePerMillion: 0.75,
          outputPricePerMillion: 4.5,
          contextWindow: 400_000
        }),
        expect.objectContaining({
          id: "gpt-4.1",
          provider: "OpenAI",
          inputPricePerMillion: 2,
          outputPricePerMillion: 8,
          contextWindow: 1_047_576
        }),
        expect.objectContaining({
          id: "claude-opus-4-7",
          provider: "Anthropic",
          inputPricePerMillion: 5,
          outputPricePerMillion: 25,
          contextWindow: 1_000_000
        }),
        expect.objectContaining({
          id: "claude-opus-4-6",
          provider: "Anthropic",
          inputPricePerMillion: 5,
          outputPricePerMillion: 25,
          contextWindow: 1_000_000
        }),
        expect.objectContaining({
          id: "claude-opus-4-1",
          provider: "Anthropic",
          inputPricePerMillion: 15,
          outputPricePerMillion: 75,
          contextWindow: 200_000
        }),
        expect.objectContaining({
          id: "claude-sonnet-4-6",
          provider: "Anthropic",
          inputPricePerMillion: 3,
          outputPricePerMillion: 15,
          contextWindow: 1_000_000
        }),
        expect.objectContaining({
          id: "claude-sonnet-4-5",
          provider: "Anthropic",
          inputPricePerMillion: 3,
          outputPricePerMillion: 15,
          contextWindow: 200_000
        }),
        expect.objectContaining({
          id: "claude-haiku-4-5-20251001",
          provider: "Anthropic",
          inputPricePerMillion: 1,
          outputPricePerMillion: 5,
          contextWindow: 200_000
        }),
        expect.objectContaining({
          id: "claude-haiku-3-5",
          provider: "Anthropic",
          inputPricePerMillion: 0.8,
          outputPricePerMillion: 4,
          contextWindow: 200_000
        })
      ])
    );
  });

  it("does not expose duplicate model IDs", () => {
    const ids = getModelOptions().map((model) => model.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers only OpenAI and Anthropic provider groups plus custom pricing", () => {
    const providers = [...new Set(getModelOptions().map((model) => model.provider))].sort();

    expect(providers).toEqual(["Anthropic", "Custom", "OpenAI"]);
  });
});

describe("getModelCatalog", () => {
  it("returns grouped selector metadata for a single organized model dropdown", () => {
    const catalog = getModelCatalog();
    const openAiGroup = catalog.groups.find((group) => group.provider === "OpenAI");
    const customOption = catalog.models.find((model) => model.id === "custom");

    expect(catalog.defaultModelId).toBe("gpt-5.5");
    expect(catalog.groups.map((group) => group.provider)).toEqual(["OpenAI", "Anthropic", "Custom"]);
    expect(openAiGroup?.models[0]).toEqual(
      expect.objectContaining({
        id: "gpt-5.5",
        group: "OpenAI",
        label: "OpenAI - GPT-5.5",
        detail: "1,000,000 context - $5/M input - $30/M output"
      })
    );
    expect(openAiGroup?.models.every((model) => model.provider === "OpenAI")).toBe(true);
    expect(customOption).toEqual(
      expect.objectContaining({
        id: "custom",
        group: "Custom",
        label: "Custom pricing",
        detail: "Manual rates - 128,000 context"
      })
    );
    expect(customOption?.searchText).toContain("manual rates");
  });

  it("keeps model-specific preview details in the catalog instead of duplicating them in estimates", () => {
    const catalog = getModelCatalog();
    const catalogModel = catalog.models.find((model) => model.id === "gpt-5.4-pro");
    const estimate = unwrapEstimate(
      calculateTokenUsage({
        text: "Estimate the backend prompt.",
        modelId: "gpt-5.4-pro",
        outputTokens: 1_000
      })
    );

    if (!catalogModel) {
      throw new Error("Expected GPT-5.4 pro in the model catalog.");
    }

    expect(catalogModel).toEqual(
      expect.objectContaining({
        inputPricePerMillion: 30,
        outputPricePerMillion: 180,
        contextWindow: 1_000_000,
        note: expect.any(String)
      })
    );
    expect(estimate.model).toEqual({
      id: "gpt-5.4-pro",
      name: "GPT-5.4 pro",
      provider: "OpenAI"
    });
    expect(estimate.model).not.toHaveProperty("inputPricePerMillion");
    expect(estimate.model).not.toHaveProperty("outputPricePerMillion");
    expect(estimate.model).not.toHaveProperty("contextWindow");
    expect(estimate.model).not.toHaveProperty("note");
    expect(estimate.assumptions.join("\n")).not.toContain(catalogModel.note);
  });
});

describe("calculateTokenUsage", () => {
  it("calculates tokens and cost from the default preset without echoing prompt text", () => {
    const prompt = "Sensitive roadmap prompt";
    const estimate = unwrapEstimate(
      calculateTokenUsage({
        text: prompt,
        outputTokens: 250
      })
    );

    expect(estimate.text.estimatedInputTokens).toBeGreaterThan(0);
    expect(estimate.outputTokens).toBe(250);
    expect(estimate.cost.inputCost).toBeCloseTo(
      (estimate.text.estimatedInputTokens * estimate.pricing.inputPricePerMillion) / 1_000_000
    );
    expect(estimate.cost.outputCost).toBeCloseTo((250 * estimate.pricing.outputPricePerMillion) / 1_000_000);
    expect(estimate.cost.totalCost).toBeCloseTo(estimate.cost.inputCost + estimate.cost.outputCost);
    expect(JSON.stringify(estimate)).not.toContain(prompt);
  });

  it("applies manual price overrides to a selected preset", () => {
    const [preset] = getModelOptions();
    const estimate = unwrapEstimate(
      calculateTokenUsage({
        text: "Compare this prompt price.",
        modelId: preset.id,
        outputTokens: "1000",
        inputPricePerMillion: "10.5",
        outputPricePerMillion: "20"
      })
    );

    expect(estimate.model.id).toBe(preset.id);
    expect(estimate.pricing.source).toBe("preset-overridden");
    expect(estimate.pricing.inputPricePerMillion).toBe(10.5);
    expect(estimate.pricing.outputPricePerMillion).toBe(20);
    expect(estimate.cost.outputCost).toBeCloseTo(0.02);
  });

  it("supports custom pricing without requiring a preset model", () => {
    const estimate = unwrapEstimate(
      calculateTokenUsage({
        text: "Custom model prompt",
        modelId: "custom",
        outputTokens: 500,
        inputPricePerMillion: 1.25,
        outputPricePerMillion: 4.75,
        contextWindow: 32_000
      })
    );

    expect(estimate.model.id).toBe("custom");
    expect(estimate.pricing.source).toBe("custom");
    expect(estimate.context.contextWindow).toBe(32_000);
  });

  it("calculates with newly added OpenAI presets", () => {
    const estimate = unwrapEstimate(
      calculateTokenUsage({
        text: "Estimate the backend prompt.",
        modelId: "gpt-5.4-pro",
        outputTokens: 1_000
      })
    );

    expect(estimate.model.id).toBe("gpt-5.4-pro");
    expect(estimate.model.provider).toBe("OpenAI");
    expect(estimate.pricing.source).toBe("preset");
    expect(estimate.pricing.inputPricePerMillion).toBe(30);
    expect(estimate.pricing.outputPricePerMillion).toBe(180);
    expect(estimate.cost.outputCost).toBeCloseTo(0.18);
    expect(estimate.context.contextWindow).toBe(1_000_000);
  });

  it("calculates with newly added Claude presets", () => {
    const estimate = unwrapEstimate(
      calculateTokenUsage({
        text: "Estimate the Claude prompt.",
        modelId: "claude-opus-4-6",
        outputTokens: 1_000
      })
    );

    expect(estimate.model.id).toBe("claude-opus-4-6");
    expect(estimate.model.provider).toBe("Anthropic");
    expect(estimate.pricing.source).toBe("preset");
    expect(estimate.pricing.inputPricePerMillion).toBe(5);
    expect(estimate.pricing.outputPricePerMillion).toBe(25);
    expect(estimate.cost.outputCost).toBeCloseTo(0.025);
    expect(estimate.context.contextWindow).toBe(1_000_000);
  });

  it("rejects non OpenAI or Claude provider presets from the shared catalog", () => {
    const errors = unwrapErrors(
      calculateTokenUsage({
        text: "Estimate an unsupported provider prompt.",
        modelId: "gemini-2.5-flash",
        outputTokens: 10
      })
    );

    expect(errors).toContainEqual({
      field: "modelId",
      message: 'Unsupported model ID "gemini-2.5-flash".'
    });
  });

  it("returns validation errors for unsupported models and invalid numeric fields", () => {
    const errors = unwrapErrors(
      calculateTokenUsage({
        text: "Invalid configuration",
        modelId: "missing-model",
        outputTokens: -1,
        inputPricePerMillion: "not-a-number",
        outputPricePerMillion: -0.01,
        contextWindow: 0
      })
    );

    expect(errors.map((error) => error.field)).toEqual([
      "modelId",
      "outputTokens",
      "inputPricePerMillion",
      "outputPricePerMillion",
      "contextWindow"
    ]);
  });

  it("rejects non-string prompt text", () => {
    const errors = unwrapErrors(
      calculateTokenUsage({
        text: { prompt: "Invalid object prompt" },
        outputTokens: 10
      })
    );

    expect(errors).toContainEqual({
      field: "text",
      message: "Text must be a string."
    });
  });

  it("reports context overflow when estimated total tokens exceed the context window", () => {
    const estimate = unwrapEstimate(
      calculateTokenUsage({
        text: "Small prompt",
        outputTokens: 101,
        contextWindow: 100
      })
    );

    expect(estimate.context.withinContextWindow).toBe(false);
    expect(estimate.context.overflowTokens).toBe(estimate.context.totalEstimatedTokens - 100);
  });

  it("rejects text above the backend request limit", () => {
    const errors = unwrapErrors(
      calculateTokenUsage({
        text: "x".repeat(MAX_TEXT_CHARACTERS + 1),
        outputTokens: 0
      })
    );

    expect(errors).toContainEqual({
      field: "text",
      message: `Text must be ${MAX_TEXT_CHARACTERS} characters or fewer.`
    });
  });
});
