import type { ModelPreset } from "../types";

const openAiStandardBillingNote =
  "Standard OpenAI text-token pricing only; excludes cached input, batch/flex/priority/regional rates, long-context premiums, tools, images, audio, and other provider-specific fees.";
const claudeStandardBillingNote =
  "Standard Claude API text-token pricing only; excludes prompt caching, batch discounts, data residency uplifts, fast mode, extended thinking, vision, and tool fees.";

export const modelPresets: ModelPreset[] = [
  {
    id: "gpt-5.5",
    name: "GPT-5.5",
    provider: "OpenAI",
    inputPricePerMillion: 5,
    outputPricePerMillion: 30,
    contextWindow: 1_050_000,
    note: openAiStandardBillingNote
  },
  {
    id: "gpt-5.5-pro",
    name: "GPT-5.5 pro",
    provider: "OpenAI",
    inputPricePerMillion: 30,
    outputPricePerMillion: 180,
    contextWindow: 1_050_000,
    note: `${openAiStandardBillingNote} Responses API only.`
  },
  {
    id: "gpt-5.4",
    name: "GPT-5.4",
    provider: "OpenAI",
    inputPricePerMillion: 2.5,
    outputPricePerMillion: 15,
    contextWindow: 1_050_000,
    note: openAiStandardBillingNote
  },
  {
    id: "gpt-5.4-pro",
    name: "GPT-5.4 pro",
    provider: "OpenAI",
    inputPricePerMillion: 30,
    outputPricePerMillion: 180,
    contextWindow: 1_050_000,
    note: `${openAiStandardBillingNote} Responses API only.`
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
    id: "gpt-4.1-nano",
    name: "GPT-4.1 nano",
    provider: "OpenAI",
    inputPricePerMillion: 0.1,
    outputPricePerMillion: 0.4,
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

export const customPreset: ModelPreset = {
  id: "custom",
  name: "Custom pricing",
  provider: "Custom",
  inputPricePerMillion: 0,
  outputPricePerMillion: 0,
  contextWindow: 128_000,
  note: "Enter the current prices for the model you want to estimate."
};
