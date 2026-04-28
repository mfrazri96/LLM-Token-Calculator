import { describe, expect, it } from "vitest";
import { customPreset, modelPresets } from "./modelPresets";

describe("modelPresets", () => {
  it("covers only the OpenAI and Claude providers in the frontend catalog", () => {
    expect(Array.from(new Set(modelPresets.map((preset) => preset.provider)))).toEqual([
      "OpenAI",
      "Anthropic"
    ]);
  });

  it("includes representative OpenAI and Claude presets", () => {
    expect(modelPresets.map((preset) => preset.id)).toEqual(
      expect.arrayContaining([
        "gpt-5.5",
        "gpt-5.4-nano",
        "claude-sonnet-4-6",
        "claude-opus-4-7",
        "claude-haiku-4-5-20251001"
      ])
    );
  });

  it("does not include non-requested model providers", () => {
    expect(modelPresets.some((preset) => ["Google", "xAI"].includes(preset.provider))).toBe(
      false
    );
  });

  it("keeps preset ids unique and pricing values non-negative", () => {
    const presetIds = modelPresets.map((preset) => preset.id);

    expect(new Set(presetIds).size).toBe(presetIds.length);

    for (const preset of modelPresets) {
      expect(preset.inputPricePerMillion).toBeGreaterThanOrEqual(0);
      expect(preset.outputPricePerMillion).toBeGreaterThanOrEqual(0);
      expect(preset.contextWindow).toBeGreaterThan(0);
      expect(preset.note).toBeTruthy();
    }
  });

  it("keeps the custom preset editable", () => {
    expect(customPreset).toMatchObject({
      id: "custom",
      provider: "Custom",
      inputPricePerMillion: 0,
      outputPricePerMillion: 0
    });
    expect(customPreset.contextWindow).toBeGreaterThan(0);
  });
});
