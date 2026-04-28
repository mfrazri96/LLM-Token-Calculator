import { handleModelOptionsRequest } from "../../src/api/tokenCalculator";
import {
  calculateTokenUsage,
  getModelCatalog,
  getModelOptions,
  type TokenCalculatorEstimate,
  type TokenCalculatorResponse
} from "../../src/server/tokenCalculatorService";

declare const process: {
  exitCode: number;
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function unwrapEstimate(response: TokenCalculatorResponse, message: string): TokenCalculatorEstimate {
  assert(response.ok, message);
  return response.estimate;
}

async function main(): Promise<void> {
  const models = getModelOptions();
  const catalog = getModelCatalog();
  const modelIds = models.map((model) => model.id);
  const providers = new Set(models.map((model) => model.provider));

  assert(catalog.defaultModelId === "gpt-5.5", "default model should be exposed for selector initialization");
  assert(
    catalog.groups.map((group) => group.provider).join(",") === "OpenAI,Anthropic,NVIDIA,Custom",
    "catalog groups should stay ordered"
  );
  assert(new Set(modelIds).size === modelIds.length, "model IDs should be unique");
  assert(modelIds.includes("gpt-5.5"), "OpenAI presets should include GPT-5.5");
  assert(modelIds.includes("gpt-5.4-pro"), "OpenAI presets should include GPT-5.4 pro");
  assert(modelIds.includes("claude-sonnet-4-6"), "Anthropic presets should include Claude Sonnet 4.6");
  assert(modelIds.includes("claude-opus-4-6"), "Anthropic presets should include Claude Opus 4.6");
  assert(modelIds.includes("nvidia-nemotron-3-super-120b-a12b"), "NVIDIA presets should include Nemotron 3 Super");
  assert(!providers.has("Google"), "Google presets should not be exposed by backend options");
  assert(!providers.has("xAI"), "xAI presets should not be exposed by backend options");

  const openAiEstimate = unwrapEstimate(
    calculateTokenUsage({
      text: "Estimate the OpenAI prompt.",
      modelId: "gpt-5.4-pro",
      outputTokens: 1_000
    }),
    "OpenAI preset should calculate successfully"
  );
  assert(openAiEstimate.model.provider === "OpenAI", "OpenAI provider should resolve to OpenAI");
  assert(!("inputPricePerMillion" in openAiEstimate.model), "estimate model should not duplicate pricing fields");
  assert(openAiEstimate.pricing.outputPricePerMillion === 180, "GPT-5.4 pro output price should match");

  const claudeEstimate = unwrapEstimate(
    calculateTokenUsage({
      text: "Estimate the Claude prompt.",
      modelId: "claude-opus-4-6",
      outputTokens: 1_000
    }),
    "Claude preset should calculate successfully"
  );
  assert(claudeEstimate.model.provider === "Anthropic", "Claude provider should resolve to Anthropic");
  assert(claudeEstimate.context.contextWindow === 1_000_000, "Claude Opus 4.6 context window should match");

  const nvidiaEstimate = unwrapEstimate(
    calculateTokenUsage({
      text: "Estimate the NVIDIA prompt.",
      modelId: "nvidia-nemotron-3-super-120b-a12b",
      outputTokens: 1_000
    }),
    "NVIDIA preset should calculate successfully"
  );
  assert(nvidiaEstimate.model.provider === "NVIDIA", "NVIDIA provider should resolve to NVIDIA");
  assert(nvidiaEstimate.context.contextWindow === 1_000_000, "NVIDIA Nemotron 3 Super context window should match");
  assert(
    Math.abs(nvidiaEstimate.cost.outputCost - 0.00075) < 1e-12,
    "NVIDIA Nemotron 3 Super output price should match"
  );

  const rejectedEstimate = calculateTokenUsage({
    text: "Estimate the unsupported provider prompt.",
    modelId: "gemini-2.5-flash",
    outputTokens: 10
  });
  assert(!rejectedEstimate.ok, "Google preset should be rejected by backend calculation");

  const response = handleModelOptionsRequest(
    new Request("https://local.test/api/model-options", {
      method: "GET"
    })
  );
  const body = (await response.json()) as { ok: boolean; models: Array<{ id: string }> };

  assert(response.status === 200, "model-options API should return 200");
  assert(body.ok === true, "model-options API should return an ok response");
  assert(body.models.some((model) => model.id === "custom"), "model-options API should include custom pricing");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
