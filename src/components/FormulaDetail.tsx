import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Katex } from './Katex';
import type { Formula } from '../types';
import { categoryMap } from '../data/categories';
import { formulas } from '../data/formulas';

interface FormulaDetailProps {
  formula: Formula;
  originRect: DOMRect | null;
  onClose: () => void;
  onJump: (formula: Formula) => void;
}

function panelTarget() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(560, vw - 48);
  const height = Math.min(640, vh - 64);
  return {
    left: (vw - width) / 2,
    top: (vh - height) / 2,
    width,
    height,
    borderRadius: 32,
  };
}

export function FormulaDetail({ formula, originRect, onClose, onJump }: FormulaDetailProps) {
  const [target] = useState(panelTarget);
  const cat = categoryMap[formula.category];

  const initial = originRect
    ? {
        left: originRect.left,
        top: originRect.top,
        width: originRect.width,
        height: originRect.height,
        borderRadius: originRect.width / 2,
        opacity: 1,
      }
    : { ...target, opacity: 0 };

  const exit = originRect
    ? {
        left: originRect.left,
        top: originRect.top,
        width: originRect.width,
        height: originRect.height,
        borderRadius: originRect.width / 2,
        opacity: 0,
      }
    : { ...target, opacity: 0 };

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const relatedFormulas = useMemo(
    () => (formula.related ?? []).map((id) => formulas.find((f) => f.id === id)).filter(Boolean),
    [formula.related],
  );

  return (
    <div className="detail-scrim" onClick={onClose}>
      <motion.div
        className="detail-panel glass"
        style={{ '--cat-color': cat.color, '--cat-soft': cat.colorSoft } as React.CSSProperties}
        initial={initial}
        animate={{ ...target, opacity: 1 }}
        exit={exit}
        transition={{ type: 'spring', damping: 28, stiffness: 260, mass: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="detail-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <span className="detail-category">{cat.name}</span>
        <h2 className="detail-title">{formula.title}</h2>
        <div className="detail-formula">
          <Katex math={formula.latex} block />
        </div>

        {formula.variables.length > 0 && (
          <div className="detail-section">
            <h3>Variables</h3>
            <ul className="detail-variables">
              {formula.variables.map((v) => (
                <li key={v.symbol}>
                  <span className="var-symbol">{v.symbol}</span>
                  <span className="var-meaning">{v.meaning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {relatedFormulas.length > 0 && (
          <div className="detail-section">
            <h3>Related formulas</h3>
            <div className="detail-related">
              {relatedFormulas.map((f) => {
                if (!f) return null;
                const relCat = categoryMap[f.category];
                return (
                  <button
                    key={f.id}
                    type="button"
                    className="related-chip"
                    style={{ '--cat-color': relCat.color } as React.CSSProperties}
                    onClick={() => onJump(f)}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
