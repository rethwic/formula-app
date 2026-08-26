import { Katex } from './Katex';
import type { Formula } from '../types';

interface FormulaGridCardProps {
  formula: Formula;
  onClick: (formula: Formula, rect: DOMRect) => void;
}

export function FormulaGridCard({ formula, onClick }: FormulaGridCardProps) {
  return (
    <button
      type="button"
      className="fgc glass"
      onClick={(e) => onClick(formula, e.currentTarget.getBoundingClientRect())}
    >
      <span className="fgc-formula">
        <Katex math={formula.latex} />
      </span>
      <span className="fgc-title">{formula.title}</span>
    </button>
  );
}
