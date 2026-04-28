import type { CSSProperties } from "react";
import type { AiBenchmarkModel } from "../types";
import {
  formatBenchmarkValue,
  normaliseBenchmarkMetric,
  type BenchmarkMetricKey
} from "../lib/benchmarkMetrics";

type BenchmarkChartProps = {
  models: AiBenchmarkModel[];
  selectedMetric: BenchmarkMetricKey;
  onMetricChange: (metric: BenchmarkMetricKey) => void;
};

type ChartMetric = {
  key: BenchmarkMetricKey;
  label: string;
  description: string;
  lowerIsBetter?: boolean;
};

const chartMetrics: ChartMetric[] = [
  {
    key: "intelligenceScore",
    label: "Intelligence",
    description: "Higher Artificial Analysis Intelligence Index is better."
  },
  {
    key: "outputSpeedTokensPerSecond",
    label: "Speed",
    description: "Higher median output tokens per second is better."
  },
  {
    key: "blendedPriceUsdPerMillion",
    label: "Price",
    description: "Lower blended USD per 1M tokens is better.",
    lowerIsBetter: true
  },
  {
    key: "latencySeconds",
    label: "Latency",
    description: "Lower seconds to first streamed chunk is better.",
    lowerIsBetter: true
  },
  {
    key: "totalResponseSeconds",
    label: "Response",
    description: "Lower end-to-end response time is better.",
    lowerIsBetter: true
  },
  {
    key: "contextWindowTokens",
    label: "Context",
    description: "Higher supported context window is better for long prompts."
  }
];

export function BenchmarkChart({
  models,
  selectedMetric,
  onMetricChange
}: BenchmarkChartProps) {
  const activeMetric =
    chartMetrics.find((metric) => metric.key === selectedMetric) ?? chartMetrics[0];

  return (
    <section className="panel benchmark-panel benchmark-chart-panel" aria-labelledby="benchmark-chart-title">
      <div className="panel-header">
        <div>
          <p className="panel-chip">Graph</p>
          <h2 id="benchmark-chart-title">Benchmark spread</h2>
          <p>Switch the metric to compare quality, speed, cost, responsiveness, or context.</p>
        </div>
        <span className="panel-status">{models.length} models</span>
      </div>

      <div className="chart-toolbar" role="group" aria-label="Benchmark metric">
        {chartMetrics.map((metric) => (
          <button
            type="button"
            className={`metric-toggle${activeMetric.key === metric.key ? " is-active" : ""}`}
            aria-pressed={activeMetric.key === metric.key}
            key={metric.key}
            onClick={() => onMetricChange(metric.key)}
          >
            {metric.label}
          </button>
        ))}
      </div>

      <div className="chart-mode-summary">
        <span>{activeMetric.description}</span>
        <strong>{activeMetric.lowerIsBetter ? "Longer bar = lower value" : "Longer bar = higher value"}</strong>
      </div>

      {models.length === 0 ? (
        <div className="benchmark-empty-state" role="status">
          No benchmark models match this filter.
        </div>
      ) : (
        <div className="benchmark-chart" role="list">
          {models.map((model) => {
            const value = model[activeMetric.key];
            const normalised = normaliseBenchmarkMetric(
              models,
              model,
              activeMetric.key,
              Boolean(activeMetric.lowerIsBetter)
            );
            const formattedValue = formatBenchmarkValue(value, activeMetric.key);

            return (
              <article
                className={`benchmark-chart-row${value === null ? " is-missing" : ""}`}
                key={model.id}
                role="listitem"
              >
                <div className="chart-model-label">
                  <span>#{model.rank}</span>
                  <strong>{model.name}</strong>
                  <small>{model.provider}</small>
                </div>

                <div
                  className="chart-bars"
                  aria-label={`${model.name} ${activeMetric.label}: ${formattedValue}`}
                >
                  <div className="chart-metric chart-metric-focus">
                    <span className="chart-metric-label">{activeMetric.label}</span>
                    <span className="chart-track" aria-hidden="true">
                      <span className="chart-fill" style={barStyle(normalised)} />
                    </span>
                    <strong>{formattedValue}</strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function barStyle(value: number): CSSProperties {
  return { "--bar-value": `${value}%` } as CSSProperties;
}
