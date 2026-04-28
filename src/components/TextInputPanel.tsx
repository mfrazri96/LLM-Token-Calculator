import type { TextTokenSummary } from "../types";
import { formatTokenCount } from "../lib/cost";

type TextInputPanelProps = {
  text: string;
  summary: TextTokenSummary;
  onChange: (value: string) => void;
};

export function TextInputPanel({ text, summary, onChange }: TextInputPanelProps) {
  const hasContent = summary.estimatedTokens > 0;

  return (
    <section className={`panel text-panel${hasContent ? " has-content" : " is-empty"}`} aria-labelledby="prompt-label">
      <div className="panel-header">
        <div>
          <span className="panel-chip">Input stream</span>
          <h2 id="prompt-label">Prompt</h2>
          <p>Paste the text you plan to send to the model.</p>
        </div>
        <div className="panel-status" aria-live="polite">
          <span className={`status-light${hasContent ? " is-live" : ""}`} aria-hidden="true" />
          <span>{hasContent ? "Measuring live" : "Awaiting text"}</span>
        </div>
      </div>

      <div className={`textarea-shell${hasContent ? " is-active" : ""}`}>
        <textarea
          aria-describedby="prompt-metrics"
          aria-labelledby="prompt-label"
          value={text}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste a prompt, system message, or draft content here..."
          spellCheck="true"
        />
      </div>

      <div id="prompt-metrics" className={`metrics-row${hasContent ? " is-live" : ""}`} aria-label="Text summary">
        <span>
          <strong>{formatTokenCount(summary.characters)}</strong>
          <small>characters</small>
        </span>
        <span>
          <strong>{formatTokenCount(summary.words)}</strong>
          <small>words</small>
        </span>
        <span>
          <strong>{formatTokenCount(summary.estimatedTokens)}</strong>
          <small>estimated tokens</small>
        </span>
      </div>
    </section>
  );
}
