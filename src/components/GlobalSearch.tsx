import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Katex } from './Katex';
import { searchFormulas } from '../lib/search';
import { formulas } from '../data/formulas';
import { categoryMap } from '../data/categories';
import { useDetail } from '../context/DetailContext';

function SearchIcon() {
  return (
    <svg className="search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const EXPANDED_BAR_HEIGHT = 64;
const RESULTS_GAP = 12;

function expandedTarget() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(600, vw - 48);
  return { left: (vw - width) / 2, top: vh * 0.32, width };
}

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [origin, setOrigin] = useState<DOMRect | null>(null);
  const restRef = useRef<HTMLDivElement>(null);
  const { openDetail } = useDetail();

  const results = useMemo(() => searchFormulas(formulas, query).slice(0, 8), [query]);
  const showResults = expanded && query.trim().length > 0;

  function openExpanded() {
    if (restRef.current) setOrigin(restRef.current.getBoundingClientRect());
    setExpanded(true);
  }

  function closeExpanded() {
    setExpanded(false);
    setQuery('');
  }

  const target = expandedTarget();

  return (
    <div className="global-search">
      {/* The resting trigger — not a real input, just what you click to
          physically expand the bar into place. Kept in the layout (just
          invisible) while expanded, so nothing else on the page shifts. */}
      <div
        ref={restRef}
        className="search-bar glass"
        style={{ visibility: expanded ? 'hidden' : 'visible', cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        aria-label="Search formulas, symbols, topics"
        onClick={openExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openExpanded();
          }
        }}
      >
        <SearchIcon />
        <span className="search-bar-placeholder">Search formulas, symbols, topics…</span>
      </div>

      <AnimatePresence>
        {expanded && origin && (
          <>
            <motion.div
              className="search-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeExpanded}
            />

            {/* The bar: a fixed-size element once expanded (icon + input +
                clear only, nothing that changes size), so typing can never
                make IT reform — it just morphs origin -> target once, on
                open/close, and otherwise sits still. */}
            <motion.div
              className="search-expand-panel glass"
              initial={{
                left: origin.left,
                top: origin.top,
                width: origin.width,
                height: origin.height,
                borderRadius: 999,
              }}
              animate={{
                left: target.left,
                top: target.top,
                width: target.width,
                height: EXPANDED_BAR_HEIGHT,
                borderRadius: 999,
              }}
              exit={{
                left: origin.left,
                top: origin.top,
                width: origin.width,
                height: origin.height,
                borderRadius: 999,
                transition: { duration: 0.22 },
              }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="search-bar-inner">
                <SearchIcon />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') closeExpanded();
                  }}
                  placeholder="Search formulas, symbols, topics…"
                  spellCheck={false}
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    className="search-clear"
                    aria-label="Clear search"
                    onClick={() => setQuery('')}
                  >
                    ×
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Results: a completely separate card, positioned just below the
          bar's fixed target spot. It grows/shrinks/fades on its own as the
          result count changes — fully decoupled from the bar above, so
          retyping never causes the bar itself to visibly reform. */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            className="search-results-card glass"
            layout
            style={{ left: target.left, top: target.top + EXPANDED_BAR_HEIGHT + RESULTS_GAP, width: target.width }}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            {results.length === 0 ? (
              <div className="search-empty">No formulas found</div>
            ) : (
              results.map((f) => {
                const cat = categoryMap[f.category];
                return (
                  <button
                    key={f.id}
                    type="button"
                    className="search-result"
                    onClick={(e) => {
                      openDetail(f, e.currentTarget.getBoundingClientRect());
                      closeExpanded();
                    }}
                  >
                    <span className="search-result-formula">
                      <Katex math={f.latex} />
                    </span>
                    <span className="search-result-meta">
                      <span className="search-result-title">{f.title}</span>
                      <span className="search-result-category">{cat.name}</span>
                    </span>
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
