import { evaluate as mjsEvaluate, parse as mjsParse } from 'mathjs/number';

// The lighter "number" build of mathjs (plain JS numbers only, no
// BigNumber/Fraction/Complex/Matrix machinery) is enough for a calculator
// that only ever plots real-valued functions, and keeps the bundle much
// smaller than the full library.

export interface PlotDef {
  /** The free variable name this curve is sampled over, e.g. "x" for
   *  "y = x^2" but "t" for "f(t) = sin(t)". */
  paramName: string;
  // Takes the current scope explicitly (rather than closing over it) so a
  // slider's live value is picked up on every sample without recompiling
  // the expression on every drag tick.
  evaluate: (paramValue: number, scope: Record<string, number>) => number;
}

export type RowResult =
  | { kind: 'empty' }
  | { kind: 'definition'; name: string; value: number }
  | { kind: 'vertical'; x: number }
  | { kind: 'plot'; plot: PlotDef }
  | { kind: 'error'; message: string };

const FUNCTION_DEF_RE = /^([a-zA-Z][a-zA-Z0-9]*)\s*\(\s*([a-zA-Z][a-zA-Z0-9]*)\s*\)\s*=\s*(.+)$/;
const DEFINITION_RE = /^([a-zA-Z][a-zA-Z0-9]*)\s*=\s*(.+)$/;

function safeNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function evaluateConstant(body: string, scope: Record<string, number>): number | null {
  try {
    return safeNumber(mjsEvaluate(body, { ...scope }));
  } catch {
    return null;
  }
}

function compilePlot(paramName: string, body: string): RowResult {
  try {
    const code = mjsParse(body).compile();
    return {
      kind: 'plot',
      plot: {
        paramName,
        evaluate: (paramValue: number, scope: Record<string, number>) => {
          try {
            const result = code.evaluate({ ...scope, [paramName]: paramValue });
            return typeof result === 'number' ? result : NaN;
          } catch {
            return NaN;
          }
        },
      },
    };
  } catch (err) {
    return { kind: 'error', message: err instanceof Error ? err.message : 'Invalid expression' };
  }
}

/**
 * Classifies one calculator row given the constants defined by rows above
 * it. Mirrors Desmos' own conventions closely enough to feel familiar:
 *  - "a = 3"        a slider-able constant, usable by later rows/plots
 *  - "x = 3"        a vertical line
 *  - "y = ..."      always plotted, even if the body happens to be a
 *                    constant (so "y = 5" draws a horizontal line, not a
 *                    scope entry named "y")
 *  - "f(t) = ..."   plotted, sampled over "t" instead of "x"
 *  - anything else  plotted as y = <expression>, or — if it parses as
 *                    "name = expression" but expression isn't a pure
 *                    constant — plotted as a named curve (e.g. "a = x^2"
 *                    behaves just like "y = x^2")
 */
export function classifyRow(text: string, scope: Record<string, number>): RowResult {
  const trimmed = text.trim();
  if (!trimmed) return { kind: 'empty' };

  const funcMatch = trimmed.match(FUNCTION_DEF_RE);
  if (funcMatch) {
    const [, , paramName, body] = funcMatch;
    return compilePlot(paramName, body);
  }

  const defMatch = trimmed.match(DEFINITION_RE);
  if (defMatch) {
    const [, name, body] = defMatch;
    if (name === 'x') {
      const value = evaluateConstant(body, scope);
      return value !== null ? { kind: 'vertical', x: value } : { kind: 'error', message: 'Invalid expression' };
    }
    if (name !== 'y') {
      const value = evaluateConstant(body, scope);
      if (value !== null) return { kind: 'definition', name, value };
    }
    return compilePlot('x', body);
  }

  return compilePlot('x', trimmed);
}

// A categorical palette for telling multiple plotted curves apart —
// distinct from the site's single-accent brand color, which is for UI
// chrome rather than for encoding data series.
export const PLOT_COLORS = ['#2d70b3', '#c74440', '#388c46', '#6042a6', '#fa7e19', '#0f9e91', '#e0499a', '#000000'];

export function colorForIndex(index: number): string {
  return PLOT_COLORS[index % PLOT_COLORS.length];
}
