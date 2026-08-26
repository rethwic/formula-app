import type { CSSProperties } from 'react';
import { Katex } from './Katex';
import type { Formula } from '../types';
import { categoryMap } from '../data/categories';

interface FormulaGridCardProps {
  formula: Formula;
  onClick: (formula: Formula, rect: DOMRect) => void;
}

export function FormulaGridCard({ formula, onClick }: FormulaGridCardProps) {
  const cat = categoryMap[formula.category];
  const style = { '--cat-soft': cat.colorSoft } as CSSProperties;

  return (
    <button
      type="button"
      className="fgc glass"
      style={style}
      onClick={(e) => onClick(formula, e.currentTarget.getBoundingClientRect())}
    >
      <span className="fgc-formula">
        <Katex math={formula.latex} />
      </span>
      <span className="fgc-title">{formula.title}</span>
    </button>
  );
}
