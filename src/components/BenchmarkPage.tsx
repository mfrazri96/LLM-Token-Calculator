import { useMemo, useState } from "react";
import { aiBenchmarkModels, benchmarkMetadata } from "../data/aiBenchmarkModels";
import {
  filterBenchmarkModels,
  formatBenchmarkValue,
  getBenchmarkHighlights,
  getBenchmarkProviders,
  type BenchmarkMetricKey
} from "../lib/benchmarkMetrics";
import { BenchmarkChart } from "./BenchmarkChart";
import { BenchmarkTable } from "./BenchmarkTable";

export function BenchmarkPage() {
  const [provider, setProvider] = useState("All");
  const [selectedMetric, setSelectedMetric] = useState<BenchmarkMetricKey>("intelligenceScore");
  const providers = useMemo(() => ["All", ...getBenchmarkProviders(aiBenchmarkModels)], []);
  const visibleModels = useMemo(() => filterBenchmarkModels(aiBenchmarkModels, provider), [provider]);
  const highlights = useMemo(() => getBenchmarkHighlights(aiBenchmarkModels), []);

  return (
    <div className="benchmark-layout">
      <section className="panel benchmark-overview" aria-labelledby="benchmark-overview-title">
        <div className="panel-header">
          <div>
            <p className="panel-chip">AI Benchmark</p>
            <h2 id="benchmark-overview-title">Top 15 frontier model snapshot</h2>
            <p>
              Updated{" "}
              <time dateTime={benchmarkMetadata.collectedAt}>{benchmarkMetadata.collectedAt}</time> from{" "}
              <a href={benchmarkMetadata.sourceUrl} target="_blank" rel="noreferrer">
                {benchmarkMetadata.sourceName}
              </a>
              .
            </p>
          </div>

          <label className="provider-filter">
            <span>Provider</span>
            <select value={provider} onChange={(event) => setProvider(event.target.value)}>
              {providers.map((providerName) => (
                <option key={providerName} value={providerName}>
                  {providerName}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="benchmark-highlight-grid">
          {highlights.map((highlight) => (
            <article className="benchmark-highlight" key={highlight.label}>
              <span>{highlight.label}</span>
              <strong>{highlight.model.name}</strong>
              <small>
                {highlight.value} - {highlight.detail}
              </small>
            </article>
          ))}
        </div>

        <div className="benchmark-source-note">
          <strong>{aiBenchmarkModels.length} models listed</strong>
          <span>{benchmarkMetadata.rankingBasis}</span>
          <span>{benchmarkMetadata.note}</span>
        </div>
      </section>

      <BenchmarkChart
        models={visibleModels}
        selectedMetric={selectedMetric}
        onMetricChange={setSelectedMetric}
      />
      <BenchmarkTable models={visibleModels} />

      <section className="panel benchmark-detail-grid" aria-label="Metric definitions">
        <div>
          <span>Intelligence</span>
          <strong>{formatBenchmarkValue(aiBenchmarkModels[0].intelligenceScore, "intelligenceScore")}</strong>
          <p>Highest score in this snapshot.</p>
        </div>
        <div>
          <span>Speed</span>
          <strong>tok/s</strong>
          <p>Median output tokens per second.</p>
        </div>
        <div>
          <span>Price</span>
          <strong>USD/M</strong>
          <p>Blended input and output token price.</p>
        </div>
        <div>
          <span>Latency</span>
          <strong>TTFC</strong>
          <p>Seconds to first streamed chunk.</p>
        </div>
        <div>
          <span>Response</span>
          <strong>end-to-end</strong>
          <p>Total response seconds for the benchmark prompt.</p>
        </div>
        <div>
          <span>Context</span>
          <strong>tokens</strong>
          <p>Maximum input and output window.</p>
        </div>
      </section>
    </div>
  );
}
