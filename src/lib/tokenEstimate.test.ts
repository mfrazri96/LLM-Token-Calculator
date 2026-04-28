import { describe, expect, it } from "vitest";
import { estimateInputTokens, summarizeText } from "./tokenEstimate";

describe("estimateInputTokens", () => {
  it("returns zero for empty text", () => {
    expect(estimateInputTokens("   ")).toBe(0);
  });

  it("returns a positive estimate for normal text", () => {
    expect(estimateInputTokens("Write a short product summary for a developer tool.")).toBeGreaterThan(0);
  });
});

describe("summarizeText", () => {
  it("reports characters, words, and estimated tokens", () => {
    const summary = summarizeText("Hello world");

    expect(summary.characters).toBe(11);
    expect(summary.words).toBe(2);
    expect(summary.estimatedTokens).toBeGreaterThan(0);
  });
});
