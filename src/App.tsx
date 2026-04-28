import { useMemo, useState } from "react";
import "./App.css";
import { BenchmarkPage } from "./components/BenchmarkPage";
import { CostSummary } from "./components/CostSummary";
import { PricingControls } from "./components/PricingControls";
import { TextInputPanel } from "./components/TextInputPanel";
import { aiBenchmarkModels, benchmarkMetadata } from "./data/aiBenchmarkModels";
import { customPreset, modelPresets } from "./data/modelPresets";
import { getBenchmarkHighlights } from "./lib/benchmarkMetrics";
import { calculateCost, formatCurrency, formatTokenCount } from "./lib/cost";
import { summarizeText } from "./lib/tokenEstimate";

const presets = [...modelPresets, customPreset];
type AppView = "calculator" | "benchmark";

function parseNonNegativeNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function getNumberError(value: string, label: string): string | null {
  if (value.trim() === "") {
    return `${label} is required.`;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return `${label} must be a number.`;
  }

  if (parsed < 0) {
    return `${label} cannot be negative.`;
  }

  return null;
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>("calculator");
  const [text, setText] = useState("");
  const [selectedModelId, setSelectedModelId] = useState(presets[0].id);
  const [inputPrice, setInputPrice] = useState(String(presets[0].inputPricePerMillion));
  const [outputPrice, setOutputPrice] = useState(String(presets[0].outputPricePerMillion));
  const [expectedOutputTokens, setExpectedOutputTokens] = useState("500");
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");

  const isCalculatorView = activeView === "calculator";
  const selectedPreset = presets.find((preset) => preset.id === selectedModelId) ?? presets[0];
  const textSummary = useMemo(() => summarizeText(text), [text]);
  const benchmarkHighlights = useMemo(() => getBenchmarkHighlights(aiBenchmarkModels), []);
  const outputTokens = parseNonNegativeNumber(expectedOutputTokens);
  const inputPriceValue = parseNonNegativeNumber(inputPrice);
  const outputPriceValue = parseNonNegativeNumber(outputPrice);
  const totalTokens = textSummary.estimatedTokens + outputTokens;
  const contextUsage =
    selectedPreset.contextWindow > 0
      ? Math.min(100, (totalTokens / selectedPreset.contextWindow) * 100)
      : 0;
  const contextUsageLabel = `${contextUsage < 1 ? contextUsage.toFixed(1) : contextUsage.toFixed(0)}%`;

  const priceError =
    getNumberError(inputPrice, "Input price") ??
    getNumberError(outputPrice, "Output price");
  const outputTokenError = getNumberError(expectedOutputTokens, "Expected output tokens");

  const costs = calculateCost({
    inputTokens: textSummary.estimatedTokens,
    outputTokens,
    inputPricePerMillion: inputPriceValue,
    outputPricePerMillion: outputPriceValue
  });

  const contextWarning =
    textSummary.estimatedTokens + outputTokens > selectedPreset.contextWindow
      ? `Estimated total tokens exceed this preset context window of ${selectedPreset.contextWindow.toLocaleString()} tokens.`
      : null;
  const hasInputText = textSummary.estimatedTokens > 0;
  const hasContextWarning = Boolean(contextWarning);

  function handleModelChange(modelId: string) {
    const nextPreset = presets.find((preset) => preset.id === modelId) ?? presets[0];
    setSelectedModelId(nextPreset.id);
    setInputPrice(String(nextPreset.inputPricePerMillion));
    setOutputPrice(String(nextPreset.outputPricePerMillion));
    setCopyStatus("idle");
  }

  function handleManualInputPrice(value: string) {
    setInputPrice(value);
    setCopyStatus("idle");
  }

  function handleManualOutputPrice(value: string) {
    setOutputPrice(value);
    setCopyStatus("idle");
  }

  function handleTextChange(value: string) {
    setText(value);
    setCopyStatus("idle");
  }

  function handleExpectedOutputTokensChange(value: string) {
    setExpectedOutputTokens(value);
    setCopyStatus("idle");
  }

  function resetCalculator() {
    const firstPreset = presets[0];
    setText("");
    setSelectedModelId(firstPreset.id);
    setInputPrice(String(firstPreset.inputPricePerMillion));
    setOutputPrice(String(firstPreset.outputPricePerMillion));
    setExpectedOutputTokens("500");
    setCopyStatus("idle");
  }

  async function copyEstimate() {
    const estimate = [
      "LLM token estimate",
      `Model: ${selectedPreset.provider} - ${selectedPreset.name}`,
      `Input tokens: ${formatTokenCount(textSummary.estimatedTokens)}`,
      `Expected output tokens: ${formatTokenCount(outputTokens)}`,
      `Input cost: ${formatCurrency(costs.inputCost)}`,
      `Output cost: ${formatCurrency(costs.outputCost)}`,
      `Total cost: ${formatCurrency(costs.totalCost)}`,
      "Assumption: approximate plain-text token estimate with editable prices."
    ].join("\n");

    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(estimate);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <main
      className={[
        "app-shell",
        `view-${activeView}`,
        isCalculatorView && hasInputText ? "has-input" : "",
        isCalculatorView && hasContextWarning ? "has-context-warning" : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="top-bar">
        <div className="hero-copy">
          <p className="eyebrow">
            {isCalculatorView ? "Realtime estimate console" : "Model benchmark console"}
          </p>
          <h1>{isCalculatorView ? "LLM Token Calculator" : "AI Benchmark"}</h1>
          <p className="hero-deck">
            {isCalculatorView
              ? "Paste a prompt, choose one model, adjust assumptions, and review the live estimate."
              : "Compare the current top 15 model entries by intelligence, speed, price, latency, and context."}
          </p>
          <div className="hero-status" aria-live="polite">
            <span
              className={`status-light${
                isCalculatorView
                  ? hasContextWarning
                    ? " is-hot"
                    : hasInputText
                      ? " is-live"
                      : ""
                  : " is-live"
              }`}
              aria-hidden="true"
            />
            <span>
              {isCalculatorView ? (
                hasContextWarning ? (
                  "Context attention"
                ) : hasInputText ? (
                  "Live estimate active"
                ) : (
                  "Ready for input"
                )
              ) : (
                <>
                  Snapshot updated{" "}
                  <time dateTime={benchmarkMetadata.collectedAt}>{benchmarkMetadata.collectedAt}</time>
                </>
              )}
            </span>
          </div>
          <div
            className="hero-metrics"
            aria-label={isCalculatorView ? "Calculator snapshot" : "Benchmark snapshot"}
          >
            {isCalculatorView ? (
              <>
                <span>
                  <strong>{formatTokenCount(textSummary.estimatedTokens)}</strong>
                  <small>input tokens</small>
                </span>
                <span>
                  <strong>{formatTokenCount(totalTokens)}</strong>
                  <small>total tokens</small>
                </span>
                <span>
                  <strong>{contextUsageLabel}</strong>
                  <small>context use</small>
                </span>
              </>
            ) : (
              benchmarkHighlights.slice(0, 3).map((highlight) => (
                <span key={highlight.label}>
                  <strong>{highlight.value}</strong>
                  <small>{highlight.label}</small>
                </span>
              ))
            )}
          </div>
        </div>
        {isCalculatorView ? (
          <div className="top-actions" aria-label="Calculator actions" data-copy-state={copyStatus}>
            <button type="button" className="secondary-button" onClick={resetCalculator}>
              Reset
            </button>
            <button type="button" className="primary-button" onClick={copyEstimate}>
              {copyStatus === "success" ? "Copied" : "Copy estimate"}
            </button>
            {copyStatus !== "idle" ? (
              <p className={`action-status${copyStatus === "error" ? " is-error" : ""}`} aria-live="polite">
                {copyStatus === "success"
                  ? "Estimate copied to your clipboard."
                  : "Clipboard access is unavailable in this environment."}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="top-actions benchmark-actions" aria-label="Benchmark source">
            <span>Updated</span>
            <strong>
              <time dateTime={benchmarkMetadata.collectedAt}>{benchmarkMetadata.collectedAt}</time>
            </strong>
            <a href={benchmarkMetadata.sourceUrl} target="_blank" rel="noreferrer">
              Source
            </a>
          </div>
        )}
      </header>

      <nav className="app-tabs" aria-label="Primary views" role="tablist">
        <button
          type="button"
          className={`tab-button${activeView === "calculator" ? " is-active" : ""}`}
          aria-controls="calculator-panel"
          aria-selected={activeView === "calculator"}
          id="calculator-tab"
          role="tab"
          onClick={() => setActiveView("calculator")}
        >
          Token Calculator
        </button>
        <button
          type="button"
          className={`tab-button${activeView === "benchmark" ? " is-active" : ""}`}
          aria-controls="benchmark-panel"
          aria-selected={activeView === "benchmark"}
          id="benchmark-tab"
          role="tab"
          onClick={() => setActiveView("benchmark")}
        >
          AI Benchmark
        </button>
      </nav>

      {isCalculatorView ? (
        <div
          className="calculator-layout"
          id="calculator-panel"
          role="tabpanel"
          aria-labelledby="calculator-tab"
        >
          <div className="main-column">
            <TextInputPanel text={text} summary={textSummary} onChange={handleTextChange} />
            <PricingControls
              presets={presets}
              selectedModelId={selectedModelId}
              selectedPreset={selectedPreset}
              inputPrice={inputPrice}
              outputPrice={outputPrice}
              expectedOutputTokens={expectedOutputTokens}
              priceError={priceError}
              outputTokenError={outputTokenError}
              onModelChange={handleModelChange}
              onInputPriceChange={handleManualInputPrice}
              onOutputPriceChange={handleManualOutputPrice}
              onExpectedOutputTokensChange={handleExpectedOutputTokensChange}
            />
          </div>

          <aside className="estimate-rail" aria-label="Current estimate">
            <CostSummary
              selectedPreset={selectedPreset}
              inputTokens={textSummary.estimatedTokens}
              outputTokens={outputTokens}
              costs={costs}
              contextWarning={contextWarning}
            />
          </aside>
        </div>
      ) : (
        <div id="benchmark-panel" role="tabpanel" aria-labelledby="benchmark-tab">
          <BenchmarkPage />
        </div>
      )}
    </main>
  );
}
