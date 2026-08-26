import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LandingPage } from './pages/LandingPage';
import { SubjectPage } from './pages/SubjectPage';
import { FormulaDetail } from './components/FormulaDetail';
import { DetailContext } from './context/DetailContext';
import type { Formula } from './types';

interface DetailState {
  formula: Formula;
  rect: DOMRect | null;
}

function App() {
  const [detail, setDetail] = useState<DetailState | null>(null);

  const openDetail = (formula: Formula, rect: DOMRect | null) => setDetail({ formula, rect });

  return (
    <DetailContext.Provider value={{ openDetail }}>
      <BrowserRouter>
        <div className="app-shell">
          <div className="aurora" aria-hidden="true" />

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/:subjectId" element={<SubjectPage />} />
          </Routes>

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
      </BrowserRouter>
    </DetailContext.Provider>
  );
}

export default App;
