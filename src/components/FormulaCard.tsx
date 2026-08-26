import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { PlacedFormula } from '../types';
import { categoryMap } from '../data/categories';

export interface PositionedFormula extends PlacedFormula {
  px: { x: number; y: number };
}

interface FormulaCardProps {
  formula: PositionedFormula;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
}

function FormulaCardBase({ formula, registerRef }: FormulaCardProps) {
  const cat = categoryMap[formula.category];

  const style: CSSProperties & Record<string, string> = {
    left: `${formula.px.x}px`,
    top: `${formula.px.y}px`,
    '--cat-color': cat.color,
    '--cat-soft': cat.colorSoft,
  };

  return (
    <div
      ref={(el) => registerRef(formula.id, el)}
      className="fc-card"
      data-card-id={formula.id}
      style={style}
      title={formula.title}
    >
      <div className="fc-ring glass" />
      <div className="fc-inner">
        <span className="fc-title">{formula.title}</span>
      </div>
    </div>
  );
}

export const FormulaCard = memo(FormulaCardBase);
