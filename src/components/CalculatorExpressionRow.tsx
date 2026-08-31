import type { RowResult } from '../lib/mathEngine';

export interface SliderRange {
  min: number;
  max: number;
}

interface CalculatorExpressionRowProps {
  text: string;
  color: string;
  result: RowResult;
  sliderRange: SliderRange;
  onChangeText: (text: string) => void;
  onChangeSliderValue: (value: number) => void;
  onChangeSliderRange: (range: SliderRange) => void;
  onDelete: () => void;
}

function formatSliderValue(value: number): string {
  return Number(value.toFixed(4)).toString();
}

export function CalculatorExpressionRow({
  text,
  color,
  result,
  sliderRange,
  onChangeText,
  onChangeSliderValue,
  onChangeSliderRange,
  onDelete,
}: CalculatorExpressionRowProps) {
  const isPlotted = result.kind === 'plot' || result.kind === 'vertical';
  const isError = result.kind === 'error';

  return (
    <div className="calculator-expr-row">
      <div className="calculator-expr-row-main">
        <span
          className="calculator-expr-dot"
          style={isPlotted ? { background: color } : undefined}
          aria-hidden="true"
        />
        <input
          type="text"
          className={`calculator-expr-input${isError ? ' calculator-expr-input-error' : ''}`}
          value={text}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder="y = x²"
          title={isError ? result.message : undefined}
          onChange={(e) => onChangeText(e.target.value)}
        />
        <button type="button" className="calculator-expr-delete" aria-label="Delete expression" onClick={onDelete}>
          ×
        </button>
      </div>

      {result.kind === 'definition' && (
        <div className="calculator-expr-slider">
          <input
            type="number"
            className="calculator-expr-slider-bound"
            value={sliderRange.min}
            onChange={(e) => onChangeSliderRange({ ...sliderRange, min: Number(e.target.value) })}
            aria-label={`Minimum value for ${result.name}`}
          />
          <input
            type="range"
            className="calculator-expr-slider-input"
            min={sliderRange.min}
            max={sliderRange.max}
            step={(sliderRange.max - sliderRange.min) / 400 || 0.01}
            value={result.value}
            style={{
              ['--fill' as string]: `${((result.value - sliderRange.min) / (sliderRange.max - sliderRange.min || 1)) * 100}%`,
            }}
            onChange={(e) => onChangeSliderValue(Number(e.target.value))}
            aria-label={`Value of ${result.name}`}
          />
          <input
            type="number"
            className="calculator-expr-slider-bound"
            value={sliderRange.max}
            onChange={(e) => onChangeSliderRange({ ...sliderRange, max: Number(e.target.value) })}
            aria-label={`Maximum value for ${result.name}`}
          />
          <span className="calculator-expr-slider-value">{formatSliderValue(result.value)}</span>
        </div>
      )}
    </div>
  );
}
