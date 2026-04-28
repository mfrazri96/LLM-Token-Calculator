import { handleModelOptionsRequest } from "../../src/api/tokenCalculator";
import { calculateTokenUsage, getModelCatalog, getModelOptions } from "../../src/server/tokenCalculatorService";

declare const process: {
  exit(code?: number): never;
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main(): Promise<void> {
  const models = getModelOptions();
  const catalog = getModelCatalog();
  const modelIds = models.map((model) => model.id);
  const providers = new Set(models.map((model) => model.provider));

  assert(catalog.defaultModelId === "gpt-5.5", "Expected GPT-5.5 as the default catalog model.");
  assert(
    catalog.groups.some((group) => group.provider === "Anthropic"),
    "Expected the catalog to group Anthropic models."
  );
  assert(modelIds.includes("gpt-5.4-pro"), "Expected GPT-5.4 pro in model options.");
  assert(modelIds.includes("claude-opus-4-6"), "Expected Claude Opus 4.6 in model options.");
  assert(!providers.has("Google"), "Expected Google presets to be excluded from model options.");
  assert(!providers.has("xAI"), "Expected xAI presets to be excluded from model options.");

  const estimateResponse = calculateTokenUsage({
    text: "Estimate the Claude prompt.",
    modelId: "claude-opus-4-6",
    outputTokens: 1_000
  });

  assert(estimateResponse.ok, "Expected a successful token estimate.");
  assert(estimateResponse.estimate.model.provider === "Anthropic", "Expected the Claude estimate to use Anthropic.");
  assert(!("contextWindow" in estimateResponse.estimate.model), "Expected estimate model metadata to stay lean.");
  assert(
    estimateResponse.estimate.context.contextWindow === 1_000_000,
    "Expected the Claude Opus 4.6 estimate to use a 1M context window."
  );
  assert(
    Math.abs(estimateResponse.estimate.cost.outputCost - 0.025) < 1e-12,
    "Expected the Claude output cost to match the preset."
  );

  const modelOptionsResponse = handleModelOptionsRequest(
    new Request("https://local.test/api/model-options", {
      method: "GET"
    })
  );
  const modelOptionsBody = (await modelOptionsResponse.json()) as {
    ok: boolean;
    defaultModelId: string;
    models: Array<{ id: string; label: string }>;
  };

  assert(modelOptionsBody.ok, "Expected the model options API response to be successful.");
  assert(modelOptionsBody.defaultModelId === "gpt-5.5", "Expected model options API to include default model ID.");
  assert(
    modelOptionsBody.models.some((model) => model.id === "gpt-5.4-pro"),
    "Expected the model options API to include GPT-5.4 pro."
  );
  assert(
    modelOptionsBody.models.some((model) => model.label === "OpenAI - GPT-5.4 pro"),
    "Expected the model options API to include dropdown labels."
  );

  console.log("backend smoke checks passed");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
