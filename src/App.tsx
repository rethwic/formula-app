import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Honeycomb } from './components/Honeycomb';
import { SearchBar } from './components/SearchBar';
import { FormulaDetail } from './components/FormulaDetail';
import { formulas } from './data/formulas';
import type { Formula } from './types';

interface DetailState {
  formula: Formula;
  rect: DOMRect | null;
}

function App() {
  const [query, setQuery] = useState('');
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [detail, setDetail] = useState<DetailState | null>(null);
  const [hintVisible, setHintVisible] = useState(true);

  return (
    <div
      className="app-shell"
      onPointerDownCapture={() => hintVisible && setHintVisible(false)}
    >
      <div className="aurora" aria-hidden="true" />

      <header className="top-bar">
        <div className="brand glass">
          <span className="brand-mark">Σ</span>
          <span className="brand-name">Formulæ</span>
        </div>
        <SearchBar value={query} onChange={setQuery} matchCount={matchCount} />
      </header>

      <Honeycomb
        formulas={formulas}
        searchQuery={query}
        onMatchCount={setMatchCount}
        onSelect={(formula, rect) => setDetail({ formula, rect })}
      />

      <div className={`hint-pill glass${hintVisible ? '' : ' hint-hidden'}`}>
        Drag to pan · Scroll or pinch to zoom · Hover to explore · Click a formula
      </div>

      <AnimatePresence>
        {detail && (
          <FormulaDetail
            formula={detail.formula}
            originRect={detail.rect}
            onClose={() => setDetail(null)}
            onJump={(formula) => setDetail({ formula, rect: null })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
