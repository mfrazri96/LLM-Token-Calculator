import type { CostBreakdown, ModelPreset } from "../types";
import { formatCurrency, formatTokenCount } from "../lib/cost";

type CostSummaryProps = {
  selectedPreset: ModelPreset;
  inputTokens: number;
  outputTokens: number;
  costs: CostBreakdown;
  contextWarning: string | null;
};

export function CostSummary({
  selectedPreset,
  inputTokens,
  outputTokens,
  costs,
  contextWarning
}: CostSummaryProps) {
  const totalTokens = inputTokens + outputTokens;
  const contextUsage =
    selectedPreset.contextWindow > 0
      ? Math.min(100, (totalTokens / selectedPreset.contextWindow) * 100)
      : 0;
  const contextUsageLabel = `${contextUsage < 1 ? contextUsage.toFixed(1) : contextUsage.toFixed(0)}%`;
  const meterTone = contextWarning ? " is-hot" : contextUsage >= 70 ? " is-warm" : "";
  const summaryTone = contextWarning ? " is-over-context" : contextUsage >= 70 ? " is-near-limit" : " is-within-context";
  const totalCost = costs.inputCost + costs.outputCost;
  const inputCostShare = totalCost > 0 ? Math.round((costs.inputCost / totalCost) * 100) : 50;
  const outputCostShare = totalCost > 0 ? 100 - inputCostShare : 50;

  return (
    <section className={`panel summary-panel${summaryTone}`} aria-labelledby="summary-label">
      <div className="panel-header">
        <div>
          <span className="panel-chip">{selectedPreset.provider}</span>
          <h2 id="summary-label">Estimate</h2>
          <p>Live cost, token totals, and context usage.</p>
        </div>
        <div className="panel-status" aria-live="polite">
          <span className={`status-light${contextWarning ? " is-hot" : contextUsage >= 70 ? " is-warm" : " is-live"}`} aria-hidden="true" />
          <span>{contextWarning ? "Over context" : contextUsage >= 70 ? "Near limit" : "Within context"}</span>
        </div>
      </div>

      <div className="total-block">
        <span>Total estimated cost</span>
        <strong>{formatCurrency(costs.totalCost)}</strong>
        <small>{formatTokenCount(totalTokens)} total tokens</small>
        <div className="cost-breakdown-bar" aria-hidden="true">
          <span style={{ width: `${inputCostShare}%` }} />
          <span style={{ width: `${outputCostShare}%` }} />
        </div>
      </div>

      <div className="context-meter" aria-label="Context window usage">
        <span id="context-meter-label">Context use</span>
        <div
          aria-labelledby="context-meter-label"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(contextUsage)}
          className={`meter-track${meterTone}`}
          role="progressbar"
        >
          <span style={{ width: contextUsageLabel }} />
        </div>
        <strong>{contextUsageLabel}</strong>
      </div>

      <dl className="summary-grid">
        <div>
          <dt>Input tokens</dt>
          <dd>{formatTokenCount(inputTokens)}</dd>
        </div>
        <div>
          <dt>Output tokens</dt>
          <dd>{formatTokenCount(outputTokens)}</dd>
        </div>
        <div>
          <dt>Total tokens</dt>
          <dd>{formatTokenCount(totalTokens)}</dd>
        </div>
        <div>
          <dt>Context limit</dt>
          <dd>{formatTokenCount(selectedPreset.contextWindow)}</dd>
        </div>
        <div>
          <dt>Input cost</dt>
          <dd>{formatCurrency(costs.inputCost)}</dd>
        </div>
        <div>
          <dt>Output cost</dt>
          <dd>{formatCurrency(costs.outputCost)}</dd>
        </div>
      </dl>

      {contextWarning ? <p className="warning-message">{contextWarning}</p> : null}

      <p className="hint">
        This estimate uses plain text only. Chat wrappers, images, tools, cached tokens, and
        provider-specific tokenizers may change billed usage.
      </p>
    </section>
  );
}
