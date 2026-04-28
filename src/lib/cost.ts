import type { CostBreakdown, CostInput } from "../types";

const PRICE_DENOMINATOR = 1_000_000;

function toNonNegativeNumber(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function calculateCost(input: CostInput): CostBreakdown {
  const inputTokens = toNonNegativeNumber(input.inputTokens);
  const outputTokens = toNonNegativeNumber(input.outputTokens);
  const inputPricePerMillion = toNonNegativeNumber(input.inputPricePerMillion);
  const outputPricePerMillion = toNonNegativeNumber(input.outputPricePerMillion);

  const inputCost = (inputTokens * inputPricePerMillion) / PRICE_DENOMINATOR;
  const outputCost = (outputTokens * outputPricePerMillion) / PRICE_DENOMINATOR;

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value > 0 && value < 0.01 ? 6 : 2,
    maximumFractionDigits: value > 0 && value < 0.01 ? 6 : 2
  }).format(value);
}

export function formatTokenCount(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(Math.max(0, Math.round(value)));
}
