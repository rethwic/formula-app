import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { classifyRow, colorForIndex, type RowResult } from '../lib/mathEngine';
import { CalculatorExpressionRow, type SliderRange } from './CalculatorExpressionRow';
import { CalculatorGraph, type GraphCurve, type GraphVertical } from './CalculatorGraph';

interface CalcRow {
  id: string;
  text: string;
  sliderRange: SliderRange;
}

interface CalculatorPanelProps {
  open: boolean;
  onClose: () => void;
}

let rowIdCounter = 0;
function makeRow(text = ''): CalcRow {
  rowIdCounter += 1;
  return { id: `calc-row-${rowIdCounter}`, text, sliderRange: { min: -10, max: 10 } };
}

export function CalculatorPanel({ open, onClose }: CalculatorPanelProps) {
  const [rows, setRows] = useState<CalcRow[]>(() => [makeRow()]);

  // A single top-down pass: each row is classified using the constants
  // defined by rows above it, and definitions accumulate into one scope
  // object used — in its final, fully-populated form — to evaluate every
  // plotted curve below, so a slider affects a graph regardless of which
  // one appears first in the list.
  const { results, scope } = useMemo(() => {
    const scope: Record<string, number> = {};
    const results: RowResult[] = [];
    for (const row of rows) {
      const result = classifyRow(row.text, scope);
      results.push(result);
      if (result.kind === 'definition') scope[result.name] = result.value;
    }
    return { results, scope };
  }, [rows]);

  const curves = useMemo<GraphCurve[]>(() => {
    const out: GraphCurve[] = [];
    rows.forEach((row, i) => {
      const result = results[i];
      if (result.kind === 'plot') {
        const plot = result.plot;
        out.push({ id: row.id, color: colorForIndex(i), evaluate: (x) => plot.evaluate(x, scope) });
      }
    });
    return out;
  }, [rows, results, scope]);

  const verticals = useMemo<GraphVertical[]>(() => {
    const out: GraphVertical[] = [];
    rows.forEach((row, i) => {
      const result = results[i];
      if (result.kind === 'vertical') out.push({ id: row.id, color: colorForIndex(i), x: result.x });
    });
    return out;
  }, [rows, results]);

  function updateRow(id: string, patch: Partial<CalcRow>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function deleteRow(id: string) {
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : [makeRow()]));
  }

  function addRow() {
    setRows((rs) => [...rs, makeRow()]);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="calculator-panel glass"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 34 }}
          role="dialog"
          aria-label="Calculator"
        >
          <div className="calculator-panel-header">
            <span className="calculator-panel-title">Calculator</span>
            <button type="button" className="calculator-panel-close" aria-label="Close calculator" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="calculator-panel-body">
            <div className="calculator-expression-list">
              {rows.map((row, i) => (
                <CalculatorExpressionRow
                  key={row.id}
                  text={row.text}
                  color={colorForIndex(i)}
                  result={results[i]}
                  sliderRange={row.sliderRange}
                  onChangeText={(text) => updateRow(row.id, { text })}
                  onChangeSliderValue={(value) => {
                    const result = results[i];
                    if (result.kind === 'definition') {
                      updateRow(row.id, { text: `${result.name} = ${value}` });
                    }
                  }}
                  onChangeSliderRange={(sliderRange) => updateRow(row.id, { sliderRange })}
                  onDelete={() => deleteRow(row.id)}
                />
              ))}
              <button type="button" className="calculator-add-row" onClick={addRow}>
                + Add expression
              </button>
            </div>
            <CalculatorGraph curves={curves} verticals={verticals} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
