import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { customPreset, modelPresets } from "../data/modelPresets";
import { PricingControls } from "./PricingControls";

describe("PricingControls", () => {
  const presets = [...modelPresets, customPreset];

  it("renders one searchable model selector with editable assumptions", () => {
    const selectedPreset =
      modelPresets.find((preset) => preset.id === "claude-opus-4-7") ?? modelPresets[0];
    const markup = renderToStaticMarkup(
      <PricingControls
        presets={presets}
        selectedModelId={selectedPreset.id}
        selectedPreset={selectedPreset}
        inputPrice={String(selectedPreset.inputPricePerMillion)}
        outputPrice={String(selectedPreset.outputPricePerMillion)}
        expectedOutputTokens="500"
        priceError={null}
        outputTokenError={null}
        onModelChange={() => undefined}
        onInputPriceChange={() => undefined}
        onOutputPriceChange={() => undefined}
        onExpectedOutputTokensChange={() => undefined}
      />
    );

    expect(markup).toContain("Assumptions");
    expect(markup).toContain("Model");
    expect(markup).toContain("model-preset-list");
    expect(markup).toContain("OpenAI - GPT-5.5");
    expect(markup).toContain("Anthropic - Claude Opus 4.7");
    expect(markup).toContain("Context window");
    expect(markup).not.toContain("Google");
    expect(markup).not.toContain("xAI");
    expect(markup).not.toContain("Load provider");
    expect(markup).not.toContain("Selected model reference");
    expect(markup).not.toContain("Preset pricing is loaded");
    expect(markup).toContain("Billing note");
  });

  it("renders the custom-pricing state copy", () => {
    const markup = renderToStaticMarkup(
      <PricingControls
        presets={presets}
        selectedModelId={customPreset.id}
        selectedPreset={customPreset}
        inputPrice="1.25"
        outputPrice="5"
        expectedOutputTokens="500"
        priceError={null}
        outputTokenError={null}
        onModelChange={() => undefined}
        onInputPriceChange={() => undefined}
        onOutputPriceChange={() => undefined}
        onExpectedOutputTokensChange={() => undefined}
      />
    );

    expect(markup).not.toContain("Custom pricing is active");
    expect(markup).toContain("Custom pricing");
    expect(markup).toContain("Manual rates");
  });
});
