import { customPreset, modelPresets } from "../data/modelPresets";
import { calculateCost } from "../lib/cost";
import { summarizeText } from "../lib/tokenEstimate";
import type { CostBreakdown, ModelPreset } from "../types";

export const MAX_TEXT_CHARACTERS = 250_000;

const openAiStandardBillingNote =
  "Standard OpenAI text-token pricing only; excludes cached input, batch/flex/priority rates, regional processing, high-context surcharges, tools, images, and audio.";
const claudeStandardBillingNote =
  "Standard Claude API global text-token pricing only; excludes prompt caching, batch discounts, data residency, fast mode, vision, and tool fees.";

const supportedPresetProviders = new Set(["OpenAI", "Anthropic"]);

const backendModelPresets: ModelPreset[] = [
  {
    id: "gpt-5.5",
    name: "GPT-5.5",
    provider: "OpenAI",
    inputPricePerMillion: 5,
    outputPricePerMillion: 30,
    contextWindow: 1_000_000,
    note: openAiStandardBillingNote
  },
  {
    id: "gpt-5.5-pro",
    name: "GPT-5.5 pro",
    provider: "OpenAI",
    inputPricePerMillion: 30,
    outputPricePerMillion: 180,
    contextWindow: 1_000_000,
    note: `${openAiStandardBillingNote} Responses API only.`
  },
  {
    id: "gpt-5.4",
    name: "GPT-5.4",
    provider: "OpenAI",
    inputPricePerMillion: 2.5,
    outputPricePerMillion: 15,
    contextWindow: 1_000_000,
    note: openAiStandardBillingNote
  },
  {
    id: "gpt-5.4-pro",
    name: "GPT-5.4 pro",
    provider: "OpenAI",
    inputPricePerMillion: 30,
    outputPricePerMillion: 180,
    contextWindow: 1_000_000,
    note: openAiStandardBillingNote
  },
  {
    id: "gpt-5.4-mini",
    name: "GPT-5.4 mini",
    provider: "OpenAI",
    inputPricePerMillion: 0.75,
    outputPricePerMillion: 4.5,
    contextWindow: 400_000,
    note: openAiStandardBillingNote
  },
  {
    id: "gpt-5.4-nano",
    name: "GPT-5.4 nano",
    provider: "OpenAI",
    inputPricePerMillion: 0.2,
    outputPricePerMillion: 1.25,
    contextWindow: 400_000,
    note: openAiStandardBillingNote
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 mini",
    provider: "OpenAI",
    inputPricePerMillion: 0.25,
    outputPricePerMillion: 2,
    contextWindow: 400_000,
    note: openAiStandardBillingNote
  },
  {
    id: "gpt-5-nano",
    name: "GPT-5 nano",
    provider: "OpenAI",
    inputPricePerMillion: 0.05,
    outputPricePerMillion: 0.4,
    contextWindow: 400_000,
    note: openAiStandardBillingNote
  },
  {
    id: "gpt-4.1-nano",
    name: "GPT-4.1 nano",
    provider: "OpenAI",
    inputPricePerMillion: 0.1,
    outputPricePerMillion: 0.4,
    contextWindow: 1_047_576,
    note: openAiStandardBillingNote
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    provider: "OpenAI",
    inputPricePerMillion: 2,
    outputPricePerMillion: 8,
    contextWindow: 1_047_576,
    note: openAiStandardBillingNote
  },
  {
    id: "gpt-4.1-mini",
    name: "GPT-4.1 mini",
    provider: "OpenAI",
    inputPricePerMillion: 0.4,
    outputPricePerMillion: 1.6,
    contextWindow: 1_047_576,
    note: openAiStandardBillingNote
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    inputPricePerMillion: 2.5,
    outputPricePerMillion: 10,
    contextWindow: 128_000,
    note: openAiStandardBillingNote
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    inputPricePerMillion: 0.15,
    outputPricePerMillion: 0.6,
    contextWindow: 128_000,
    note: openAiStandardBillingNote
  },
  {
    id: "claude-opus-4-7",
    name: "Claude Opus 4.7",
    provider: "Anthropic",
    inputPricePerMillion: 5,
    outputPricePerMillion: 25,
    contextWindow: 1_000_000,
    note: claudeStandardBillingNote
  },
  {
    id: "claude-opus-4-6",
    name: "Claude Opus 4.6",
    provider: "Anthropic",
    inputPricePerMillion: 5,
    outputPricePerMillion: 25,
    contextWindow: 1_000_000,
    note: claudeStandardBillingNote
  },
  {
    id: "claude-opus-4-5",
    name: "Claude Opus 4.5",
    provider: "Anthropic",
    inputPricePerMillion: 5,
    outputPricePerMillion: 25,
    contextWindow: 200_000,
    note: claudeStandardBillingNote
  },
  {
    id: "claude-opus-4-1",
    name: "Claude Opus 4.1",
    provider: "Anthropic",
    inputPricePerMillion: 15,
    outputPricePerMillion: 75,
    contextWindow: 200_000,
    note: claudeStandardBillingNote
  },
  {
    id: "claude-opus-4",
    name: "Claude Opus 4",
    provider: "Anthropic",
    inputPricePerMillion: 15,
    outputPricePerMillion: 75,
    contextWindow: 200_000,
    note: claudeStandardBillingNote
  },
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    inputPricePerMillion: 3,
    outputPricePerMillion: 15,
    contextWindow: 1_000_000,
    note: claudeStandardBillingNote
  },
  {
    id: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    provider: "Anthropic",
    inputPricePerMillion: 3,
    outputPricePerMillion: 15,
    contextWindow: 200_000,
    note: claudeStandardBillingNote
  },
  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    inputPricePerMillion: 3,
    outputPricePerMillion: 15,
    contextWindow: 200_000,
    note: claudeStandardBillingNote
  },
  {
    id: "claude-haiku-4-5-20251001",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    inputPricePerMillion: 1,
    outputPricePerMillion: 5,
    contextWindow: 200_000,
    note: claudeStandardBillingNote
  },
  {
    id: "claude-haiku-3-5",
    name: "Claude Haiku 3.5",
    provider: "Anthropic",
    inputPricePerMillion: 0.8,
    outputPricePerMillion: 4,
    contextWindow: 200_000,
    note: claudeStandardBillingNote
  },
  {
    id: "claude-haiku-3",
    name: "Claude Haiku 3",
    provider: "Anthropic",
    inputPricePerMillion: 0.25,
    outputPricePerMillion: 1.25,
    contextWindow: 200_000,
    note: claudeStandardBillingNote
  }
];

export type TokenCalculatorRequest = {
  text?: unknown;
  modelId?: unknown;
  outputTokens?: unknown;
  inputPricePerMillion?: unknown;
  outputPricePerMillion?: unknown;
  contextWindow?: unknown;
};

export type TokenCalculatorValidationField = keyof TokenCalculatorRequest | "request";

export type TokenCalculatorValidationError = {
  field: TokenCalculatorValidationField;
  message: string;
};

export type PricingSource = "preset" | "preset-overridden" | "custom";

export type SelectedModel = Pick<ModelPreset, "id" | "name" | "provider">;

export type ModelSelectorOption = ModelPreset & {
  group: string;
  label: string;
  detail: string;
  searchText: string;
};

export type ModelSelectorGroup = {
  provider: string;
  label: string;
  models: ModelSelectorOption[];
};

export type ModelCatalog = {
  defaultModelId: string;
  models: ModelSelectorOption[];
  groups: ModelSelectorGroup[];
};

export type TokenCalculatorEstimate = {
  model: SelectedModel;
  pricing: {
    inputPricePerMillion: number;
    outputPricePerMillion: number;
    source: PricingSource;
  };
  text: {
    characters: number;
    words: number;
    estimatedInputTokens: number;
  };
  outputTokens: number;
  cost: CostBreakdown;
  context: {
    contextWindow: number;
    totalEstimatedTokens: number;
    withinContextWindow: boolean;
    overflowTokens: number;
  };
  assumptions: string[];
};

export type TokenCalculatorResponse =
  | {
      ok: true;
      estimate: TokenCalculatorEstimate;
    }
  | {
      ok: false;
      errors: TokenCalculatorValidationError[];
    };

type NumericField = Exclude<keyof TokenCalculatorRequest, "text" | "modelId">;

function copyPreset(preset: ModelPreset): ModelPreset {
  return { ...preset };
}

function modelCatalog(): ModelPreset[] {
  const presetsById = new Map<string, ModelPreset>();

  for (const preset of backendModelPresets) {
    presetsById.set(preset.id, preset);
  }

  for (const preset of modelPresets) {
    if (supportedPresetProviders.has(preset.provider) && !presetsById.has(preset.id)) {
      presetsById.set(preset.id, preset);
    }
  }

  return Array.from(presetsById.values());
}

function defaultModelId(): string {
  return modelCatalog()[0]?.id ?? customPreset.id;
}

function findPreset(modelId: string): ModelPreset | undefined {
  if (modelId === customPreset.id) {
    return customPreset;
  }

  return modelCatalog().find((preset) => preset.id === modelId);
}

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && !(typeof value === "string" && value.trim() === "");
}

function parseText(value: unknown, errors: TokenCalculatorValidationError[]): string {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value !== "string") {
    errors.push({
      field: "text",
      message: "Text must be a string."
    });
    return "";
  }

  if (value.length > MAX_TEXT_CHARACTERS) {
    errors.push({
      field: "text",
      message: `Text must be ${MAX_TEXT_CHARACTERS} characters or fewer.`
    });
  }

  return value;
}

function parseModelId(value: unknown, errors: TokenCalculatorValidationError[]): string {
  if (value === undefined || value === null || value === "") {
    return defaultModelId();
  }

  if (typeof value !== "string") {
    errors.push({
      field: "modelId",
      message: "Model ID must be a string."
    });
    return defaultModelId();
  }

  const trimmed = value.trim();
  return trimmed || defaultModelId();
}

function parseNumber(
  field: NumericField,
  value: unknown,
  fallback: number,
  errors: TokenCalculatorValidationError[],
  options: {
    integer?: boolean;
    minimum?: number;
    minimumLabel?: string;
  } = {}
): number {
  if (!hasValue(value)) {
    return fallback;
  }

  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value.trim()) : NaN;

  if (!Number.isFinite(parsed)) {
    errors.push({
      field,
      message: `${field} must be a finite number.`
    });
    return fallback;
  }

  if (options.integer && !Number.isInteger(parsed)) {
    errors.push({
      field,
      message: `${field} must be a whole number.`
    });
    return fallback;
  }

  if (options.minimum !== undefined && parsed < options.minimum) {
    errors.push({
      field,
      message: `${field} must be ${options.minimumLabel ?? `at least ${options.minimum}`}.`
    });
    return fallback;
  }

  return parsed;
}

function pricingSourceFor(selectedPreset: ModelPreset, hasPriceOverride: boolean): PricingSource {
  if (selectedPreset.id === customPreset.id) {
    return "custom";
  }

  return hasPriceOverride ? "preset-overridden" : "preset";
}

function selectedModelFor(preset: ModelPreset): SelectedModel {
  return {
    id: preset.id,
    name: preset.name,
    provider: preset.provider
  };
}

function formatModelOptionLabel(preset: ModelPreset): string {
  return preset.id === customPreset.id ? preset.name : `${preset.provider} - ${preset.name}`;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 3
  }).format(value);
}

function formatModelOptionDetail(preset: ModelPreset): string {
  const contextWindow = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(preset.contextWindow);

  if (preset.id === customPreset.id) {
    return `Manual rates - ${contextWindow} context`;
  }

  return `${contextWindow} context - $${formatNumber(preset.inputPricePerMillion)}/M input - $${formatNumber(
    preset.outputPricePerMillion
  )}/M output`;
}

function toSelectorOption(preset: ModelPreset): ModelSelectorOption {
  const label = formatModelOptionLabel(preset);
  const detail = formatModelOptionDetail(preset);

  return {
    ...copyPreset(preset),
    group: preset.provider,
    label,
    detail,
    searchText: [preset.id, preset.name, preset.provider, label, detail].join(" ").toLowerCase()
  };
}

function groupSelectorOptions(models: ModelSelectorOption[]): ModelSelectorGroup[] {
  const groups: ModelSelectorGroup[] = [];
  const groupByProvider = new Map<string, ModelSelectorGroup>();

  for (const model of models) {
    let group = groupByProvider.get(model.provider);

    if (!group) {
      group = {
        provider: model.provider,
        label: model.provider === "Custom" ? "Custom pricing" : model.provider,
        models: []
      };
      groupByProvider.set(model.provider, group);
      groups.push(group);
    }

    group.models.push(model);
  }

  return groups;
}

function buildAssumptions(): string[] {
  return [
    "Token count is an estimate for plain text only.",
    "Output tokens are user-estimated before generation.",
    "Costs exclude chat wrappers, tool calls, images, cached tokens, discounts, and provider-specific billing rules."
  ];
}

export function getModelOptions(): ModelPreset[] {
  return [...modelCatalog(), customPreset].map(copyPreset);
}

export function getModelSelectorOptions(): ModelSelectorOption[] {
  return getModelOptions().map(toSelectorOption);
}

export function getModelCatalog(): ModelCatalog {
  const models = getModelSelectorOptions();

  return {
    defaultModelId: defaultModelId(),
    models,
    groups: groupSelectorOptions(models)
  };
}

export function calculateTokenUsage(request: TokenCalculatorRequest = {}): TokenCalculatorResponse {
  const errors: TokenCalculatorValidationError[] = [];
  const text = parseText(request.text, errors);
  const modelId = parseModelId(request.modelId, errors);
  const selectedPreset = findPreset(modelId);

  if (!selectedPreset) {
    errors.push({
      field: "modelId",
      message: `Unsupported model ID "${modelId}".`
    });
  }

  const effectivePreset = selectedPreset ?? customPreset;
  const outputTokens = parseNumber("outputTokens", request.outputTokens, 0, errors, {
    integer: true,
    minimum: 0,
    minimumLabel: "zero or greater"
  });
  const inputPricePerMillion = parseNumber(
    "inputPricePerMillion",
    request.inputPricePerMillion,
    effectivePreset.inputPricePerMillion,
    errors,
    {
      minimum: 0,
      minimumLabel: "zero or greater"
    }
  );
  const outputPricePerMillion = parseNumber(
    "outputPricePerMillion",
    request.outputPricePerMillion,
    effectivePreset.outputPricePerMillion,
    errors,
    {
      minimum: 0,
      minimumLabel: "zero or greater"
    }
  );
  const contextWindow = parseNumber("contextWindow", request.contextWindow, effectivePreset.contextWindow, errors, {
    integer: true,
    minimum: 1,
    minimumLabel: "at least one token"
  });

  if (errors.length > 0) {
    return {
      ok: false,
      errors
    };
  }

  const textSummary = summarizeText(text);
  const cost = calculateCost({
    inputTokens: textSummary.estimatedTokens,
    outputTokens,
    inputPricePerMillion,
    outputPricePerMillion
  });
  const totalEstimatedTokens = textSummary.estimatedTokens + outputTokens;
  const overflowTokens = Math.max(0, totalEstimatedTokens - contextWindow);
  const hasPriceOverride = hasValue(request.inputPricePerMillion) || hasValue(request.outputPricePerMillion);

  return {
    ok: true,
    estimate: {
      model: selectedModelFor(effectivePreset),
      pricing: {
        inputPricePerMillion,
        outputPricePerMillion,
        source: pricingSourceFor(effectivePreset, hasPriceOverride)
      },
      text: {
        characters: textSummary.characters,
        words: textSummary.words,
        estimatedInputTokens: textSummary.estimatedTokens
      },
      outputTokens,
      cost,
      context: {
        contextWindow,
        totalEstimatedTokens,
        withinContextWindow: overflowTokens === 0,
        overflowTokens
      },
      assumptions: buildAssumptions()
    }
  };
}
