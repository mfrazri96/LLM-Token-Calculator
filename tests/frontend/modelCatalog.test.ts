import { describe, expect, it } from "vitest";
import { customPreset, modelPresets } from "../../src/data/modelPresets";

describe("model catalog", () => {
  it("includes only the requested major providers", () => {
    const providers = new Set(modelPresets.map((preset) => preset.provider));

    expect(providers).toEqual(new Set(["OpenAI", "Anthropic"]));
  });

  it("keeps at least one preset for each provider", () => {
    const counts = modelPresets.reduce<Record<string, number>>((providerCounts, preset) => {
      providerCounts[preset.provider] = (providerCounts[preset.provider] ?? 0) + 1;
      return providerCounts;
    }, {});

    expect(counts.OpenAI).toBeGreaterThan(0);
    expect(counts.Anthropic).toBeGreaterThan(0);
    expect(counts.Google).toBeUndefined();
    expect(counts.xAI).toBeUndefined();
  });

  it("includes expanded OpenAI and Claude model families", () => {
    const presetIds = modelPresets.map((preset) => preset.id);

    expect(presetIds).toEqual(
      expect.arrayContaining([
        "gpt-5.5",
        "gpt-5.4-pro",
        "gpt-4.1-nano",
        "claude-opus-4-7",
        "claude-sonnet-4-6",
        "claude-haiku-4-5-20251001"
      ])
    );
  });

  it("preserves the editable custom pricing fallback", () => {
    expect(customPreset.id).toBe("custom");
    expect(customPreset.inputPricePerMillion).toBe(0);
    expect(customPreset.outputPricePerMillion).toBe(0);
  });
});
