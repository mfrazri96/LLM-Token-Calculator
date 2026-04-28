import { renderToStaticMarkup } from "react-dom/server";
import { BenchmarkPage } from "../../src/components/BenchmarkPage";
import { PricingControls } from "../../src/components/PricingControls";
import { aiBenchmarkModels } from "../../src/data/aiBenchmarkModels";
import { customPreset, modelPresets } from "../../src/data/modelPresets";

function ensure(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function ensureEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`${message} Expected: ${String(expected)}. Received: ${String(actual)}.`);
  }
}

function ensureArrayEqual(actual: string[], expected: string[], message: string) {
  if (actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    throw new Error(`${message} Expected: ${expected.join(", ")}. Received: ${actual.join(", ")}.`);
  }
}

function ensureIncludes(haystack: string, needle: string, message: string) {
  if (!haystack.includes(needle)) {
    throw new Error(`${message} Missing: ${needle}`);
  }
}

function ensureExcludes(haystack: string, needle: string, message: string) {
  if (haystack.includes(needle)) {
    throw new Error(`${message} Unexpected: ${needle}`);
  }
}

const presets = [...modelPresets, customPreset];
const providers = Array.from(new Set(modelPresets.map((preset) => preset.provider)));
const presetIds = new Set(modelPresets.map((preset) => preset.id));

ensureArrayEqual(
  providers,
  ["OpenAI", "Anthropic"],
  "Provider coverage changed unexpectedly."
);
ensureEqual(presetIds.size, modelPresets.length, "Model preset ids must stay unique.");

for (const presetId of [
  "gpt-5.5",
  "gpt-5.4-nano",
  "gpt-4.1-nano",
  "claude-opus-4-7",
  "claude-sonnet-4-6",
  "claude-haiku-4-5-20251001"
]) {
  ensure(presetIds.has(presetId), `Missing expected preset: ${presetId}`);
}

const selectedPreset = modelPresets.find((preset) => preset.id === "claude-opus-4-7");
ensure(selectedPreset, "Claude preset should exist for frontend rendering checks.");

const presetMarkup = renderToStaticMarkup(
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

for (const expectedText of [
  "Assumptions",
  "model-preset-list",
  "OpenAI - GPT-5.5",
  "Anthropic - Claude Opus 4.7",
  "Context window",
  "Billing note"
]) {
  ensureIncludes(presetMarkup, expectedText, "Rendered pricing controls are missing expected text.");
}

for (const unexpectedText of [
  "Google",
  "xAI",
  "Gemini",
  "Grok",
  "Load provider",
  "Find a preset",
  "Preset pricing is loaded"
]) {
  ensureExcludes(presetMarkup, unexpectedText, "Rendered pricing controls include a non-requested provider.");
}

const customMarkup = renderToStaticMarkup(
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

ensureExcludes(
  customMarkup,
  "Custom pricing is active",
  "Rendered pricing controls still include redundant custom status copy."
);
ensureIncludes(customMarkup, "Manual rates", "Custom pricing option should still expose manual rates.");

const benchmarkMarkup = renderToStaticMarkup(<BenchmarkPage />);

ensureEqual(aiBenchmarkModels.length, 15, "AI Benchmark must list exactly 15 model entries.");

for (const expectedText of [
  "Top 15 frontier model snapshot",
  "Benchmark metric",
  "GPT-5.5 (xhigh)",
  "Context",
  "Artificial Analysis Intelligence Index"
]) {
  ensureIncludes(benchmarkMarkup, expectedText, "Rendered benchmark page is missing expected text.");
}

console.log("Frontend smoke check passed.");
