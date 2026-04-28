import type { AiBenchmarkModel } from "../types";
import { formatBenchmarkValue, formatContextWindow } from "../lib/benchmarkMetrics";

type BenchmarkTableProps = {
  models: AiBenchmarkModel[];
};

export function BenchmarkTable({ models }: BenchmarkTableProps) {
  return (
    <section className="panel benchmark-panel benchmark-table-panel" aria-labelledby="benchmark-table-title">
      <div className="panel-header">
        <div>
          <p className="panel-chip">Ranked table</p>
          <h2 id="benchmark-table-title">Top model comparison</h2>
          <p>Sorted by the current Artificial Analysis Intelligence Index ranking.</p>
        </div>
      </div>

      <div className="benchmark-table-wrap">
        <table className="benchmark-table">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Model</th>
              <th scope="col">Provider</th>
              <th scope="col">Intelligence</th>
              <th scope="col">Speed</th>
              <th scope="col">Price</th>
              <th scope="col">Latency</th>
              <th scope="col">Response</th>
              <th scope="col">Context</th>
              <th scope="col">Best fit</th>
            </tr>
          </thead>
          <tbody>
            {models.length === 0 ? (
              <tr>
                <td className="benchmark-empty-cell" colSpan={10}>
                  No model rows match this filter.
                </td>
              </tr>
            ) : (
              models.map((model) => (
                <tr key={model.id}>
                  <td>#{model.rank}</td>
                  <th scope="row">
                    <span className="model-name">{model.name}</span>
                  </th>
                  <td>{model.provider}</td>
                  <td>{formatBenchmarkValue(model.intelligenceScore, "intelligenceScore")}</td>
                  <td>{formatBenchmarkValue(model.outputSpeedTokensPerSecond, "outputSpeedTokensPerSecond")}</td>
                  <td>{formatBenchmarkValue(model.blendedPriceUsdPerMillion, "blendedPriceUsdPerMillion")}</td>
                  <td>{formatBenchmarkValue(model.latencySeconds, "latencySeconds")}</td>
                  <td>{formatBenchmarkValue(model.totalResponseSeconds, "totalResponseSeconds")}</td>
                  <td>{formatContextWindow(model.contextWindowTokens)}</td>
                  <td>
                    <div className="strength-list">
                      {model.strengths.slice(0, 2).map((strength) => (
                        <span key={strength}>{strength}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
