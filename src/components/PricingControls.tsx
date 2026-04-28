import { useEffect, useMemo, useState } from "react";
import type { ModelPreset } from "../types";
import { formatTokenCount } from "../lib/cost";

type PricingControlsProps = {
  presets: ModelPreset[];
  selectedModelId: string;
  inputPrice: string;
  outputPrice: string;
  expectedOutputTokens: string;
  selectedPreset: ModelPreset;
  priceError: string | null;
  outputTokenError: string | null;
  onModelChange: (modelId: string) => void;
  onInputPriceChange: (value: string) => void;
  onOutputPriceChange: (value: string) => void;
  onExpectedOutputTokensChange: (value: string) => void;
};

function modelOptionLabel(preset: ModelPreset): string {
  return preset.id === "custom" ? preset.name : `${preset.provider} - ${preset.name}`;
}

function modelOptionDetail(preset: ModelPreset): string {
  if (preset.id === "custom") {
    return `Manual rates - ${formatTokenCount(preset.contextWindow)} context`;
  }

  return `${formatTokenCount(preset.contextWindow)} context - $${preset.inputPricePerMillion}/M input - $${preset.outputPricePerMillion}/M output`;
}

export function PricingControls({
  presets,
  selectedModelId,
  inputPrice,
  outputPrice,
  expectedOutputTokens,
  selectedPreset,
  priceError,
  outputTokenError,
  onModelChange,
  onInputPriceChange,
  onOutputPriceChange,
  onExpectedOutputTokensChange
}: PricingControlsProps) {
  const modelOptions = useMemo(
    () =>
      presets.map((preset) => ({
        id: preset.id,
        label: modelOptionLabel(preset),
        preset
      })),
    [presets]
  );
  const selectedLabel = modelOptionLabel(selectedPreset);
  const [modelSearch, setModelSearch] = useState(selectedLabel);
  const hasPriceError = Boolean(priceError);
  const hasOutputTokenError = Boolean(outputTokenError);
  const hasValidationError = hasPriceError || hasOutputTokenError;

  useEffect(() => {
    setModelSearch(selectedLabel);
  }, [selectedLabel]);

  function findExactModel(value: string) {
    const normalizedValue = value.trim().toLowerCase();

    return modelOptions.find(
      (option) =>
        option.label.toLowerCase() === normalizedValue ||
        option.preset.id.toLowerCase() === normalizedValue
    );
  }

  function handleModelInputChange(value: string) {
    setModelSearch(value);

    const exactOption = findExactModel(value);
    if (exactOption && exactOption.id !== selectedModelId) {
      onModelChange(exactOption.id);
    }
  }

  function handleModelInputBlur() {
    const exactOption = findExactModel(modelSearch);

    if (!exactOption) {
      setModelSearch(selectedLabel);
      return;
    }

    setModelSearch(exactOption.label);

    if (exactOption.id !== selectedModelId) {
      onModelChange(exactOption.id);
    }
  }

  return (
    <section
      className={`panel assumptions-panel${hasValidationError ? " has-validation-error" : ""}`}
      aria-labelledby="assumptions-label"
    >
      <div className="panel-header">
        <div>
          <span className="panel-chip">Model profile</span>
          <h2 id="assumptions-label">Assumptions</h2>
          <p>Model, output length, and token prices for this estimate.</p>
        </div>
        <div className="panel-status" aria-live="polite">
          <span className={`status-light${hasValidationError ? " is-hot" : " is-live"}`} aria-hidden="true" />
          <span>{hasValidationError ? "Review values" : "Rates editable"}</span>
        </div>
      </div>

      <div className="control-stack">
        <div className="selected-model-card" aria-label="Selected model summary">
          <span>Selected model</span>
          <strong>{selectedLabel}</strong>
          <small>{modelOptionDetail(selectedPreset)}</small>
        </div>

        <label className="model-selector">
          <span className="field-label">Model</span>
          <input
            list="model-preset-list"
            type="search"
            value={modelSearch}
            onBlur={handleModelInputBlur}
            onChange={(event) => handleModelInputChange(event.target.value)}
            placeholder="Search model..."
          />
        </label>
        <datalist id="model-preset-list">
          {modelOptions.map((option) => (
            <option key={option.id} value={option.label} label={modelOptionDetail(option.preset)} />
          ))}
        </datalist>

        <div className="assumption-strip" aria-label="Selected context window">
          <span>Context window</span>
          <strong>{formatTokenCount(selectedPreset.contextWindow)} tokens</strong>
        </div>

        <div className="field-grid">
          <label className="numeric-field">
            <span className="field-label">Input price per 1M tokens</span>
            <input
              aria-describedby={priceError ? "price-error" : undefined}
              aria-invalid={hasPriceError}
              inputMode="decimal"
              min="0"
              type="number"
              value={inputPrice}
              onChange={(event) => onInputPriceChange(event.target.value)}
            />
          </label>

          <label className="numeric-field">
            <span className="field-label">Output price per 1M tokens</span>
            <input
              aria-describedby={priceError ? "price-error" : undefined}
              aria-invalid={hasPriceError}
              inputMode="decimal"
              min="0"
              type="number"
              value={outputPrice}
              onChange={(event) => onOutputPriceChange(event.target.value)}
            />
          </label>
        </div>

        {priceError ? (
          <p id="price-error" className="error-message">
            {priceError}
          </p>
        ) : null}

        <label className="numeric-field">
          <span className="field-label">Expected output tokens</span>
          <input
            aria-describedby={outputTokenError ? "output-token-error" : undefined}
            aria-invalid={hasOutputTokenError}
            inputMode="numeric"
            min="0"
            type="number"
            value={expectedOutputTokens}
            onChange={(event) => onExpectedOutputTokensChange(event.target.value)}
          />
        </label>

        {outputTokenError ? (
          <p id="output-token-error" className="error-message">
            {outputTokenError}
          </p>
        ) : null}

        {selectedPreset.note ? (
          <details className="billing-note">
            <summary>Billing note</summary>
            <p>{selectedPreset.note}</p>
          </details>
        ) : null}
      </div>
    </section>
  );
}
