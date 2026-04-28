import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PricingControls } from "../../src/components/PricingControls";
import { customPreset, modelPresets } from "../../src/data/modelPresets";

describe("PricingControls", () => {
  it("renders the streamlined assumptions panel", () => {
    const markup = renderToStaticMarkup(
      <PricingControls
        presets={[...modelPresets, customPreset]}
        selectedModelId={modelPresets[0].id}
        selectedPreset={modelPresets[0]}
        inputPrice={String(modelPresets[0].inputPricePerMillion)}
        outputPrice={String(modelPresets[0].outputPricePerMillion)}
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
    expect(markup).toContain("model-preset-list");
    expect(markup).toContain("OpenAI - GPT-5.5");
    expect(markup).toContain("Anthropic - Claude Opus 4.7");
    expect(markup).toContain("Context window");
    expect(markup).toContain("Billing note");
    expect(markup).not.toContain("Google");
    expect(markup).not.toContain("xAI");
    expect(markup).not.toContain("Load provider");
    expect(markup).not.toContain("Find a preset");
    expect(markup).not.toContain("Preset pricing is loaded");
  });
});
