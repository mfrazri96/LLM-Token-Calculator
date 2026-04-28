import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { aiBenchmarkModels, benchmarkMetadata } from "../data/aiBenchmarkModels";
import { BenchmarkChart } from "./BenchmarkChart";
import { BenchmarkPage } from "./BenchmarkPage";
import { BenchmarkTable } from "./BenchmarkTable";

describe("BenchmarkPage", () => {
  it("renders the dated top-15 benchmark snapshot", () => {
    const markup = renderToStaticMarkup(<BenchmarkPage />);

    expect(aiBenchmarkModels).toHaveLength(15);
    expect(markup).toContain("Top 15 frontier model snapshot");
    expect(markup).toContain(`dateTime="${benchmarkMetadata.collectedAt}"`);
    expect(markup).toContain("GPT-5.5 (xhigh)");
    expect(markup).toContain("Artificial Analysis Intelligence Index");
    expect(markup).toContain("Benchmark spread");
    expect(markup).toContain("Benchmark metric");
    expect(markup).toContain("Response");
  });

  it("renders empty states for chart and table filters", () => {
    const chartMarkup = renderToStaticMarkup(
      <BenchmarkChart
        models={[]}
        selectedMetric="intelligenceScore"
        onMetricChange={() => undefined}
      />
    );
    const tableMarkup = renderToStaticMarkup(<BenchmarkTable models={[]} />);

    expect(chartMarkup).toContain("No benchmark models match this filter.");
    expect(tableMarkup).toContain("No model rows match this filter.");
  });

  it("renders a focused context comparison graph", () => {
    const markup = renderToStaticMarkup(
      <BenchmarkChart
        models={aiBenchmarkModels.slice(0, 2)}
        selectedMetric="contextWindowTokens"
        onMetricChange={() => undefined}
      />
    );

    expect(markup).toContain("Higher supported context window is better");
    expect(markup).toContain("Longer bar = higher value");
    expect(markup).toContain("922k");
  });
});
