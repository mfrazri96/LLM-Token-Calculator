import type { TextTokenSummary } from "../types";

export function estimateInputTokens(text: string): number {
  const trimmed = text.trim();

  if (!trimmed) {
    return 0;
  }

  const normalized = trimmed.replace(/\s+/g, " ");
  const characters = normalized.length;
  const words = normalized.split(" ").filter(Boolean).length;
  const punctuationMarks = normalized.match(/[^\w\s]/g)?.length ?? 0;

  const characterEstimate = Math.ceil(characters / 4);
  const wordEstimate = Math.ceil(words * 1.33 + punctuationMarks * 0.25);

  return Math.max(characterEstimate, wordEstimate, 1);
}

export function summarizeText(text: string): TextTokenSummary {
  const trimmed = text.trim();

  return {
    characters: text.length,
    words: trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0,
    estimatedTokens: estimateInputTokens(text)
  };
}
