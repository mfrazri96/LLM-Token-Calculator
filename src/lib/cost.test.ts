import { describe, expect, it } from "vitest";
import { calculateCost } from "./cost";

describe("calculateCost", () => {
  it("calculates input, output, and total cost", () => {
    expect(
      calculateCost({
        inputTokens: 10_000,
        outputTokens: 2_000,
        inputPricePerMillion: 0.5,
        outputPricePerMillion: 1.5
      })
    ).toEqual({
      inputCost: 0.005,
      outputCost: 0.003,
      totalCost: 0.008
    });
  });

  it("treats invalid negative values as zero", () => {
    expect(
      calculateCost({
        inputTokens: -10,
        outputTokens: 100,
        inputPricePerMillion: -1,
        outputPricePerMillion: 2
      }).totalCost
    ).toBe(0.0002);
  });
});
