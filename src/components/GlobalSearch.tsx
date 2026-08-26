import { useMemo, useState } from 'react';
import { Katex } from './Katex';
import { searchFormulas } from '../lib/search';
import { formulas } from '../data/formulas';
import { categoryMap } from '../data/categories';
import { useDetail } from '../context/DetailContext';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const { openDetail } = useDetail();

  const results = useMemo(() => searchFormulas(formulas, query).slice(0, 8), [query]);
  const showResults = focused && query.trim().length > 0;

  return (
    <div className="global-search">
      <div className="search-bar glass">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
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

      {showResults && (
        <div className="search-results glass">
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
                    setQuery('');
                  }}
                >
                  <span className="search-result-formula">
                    <Katex math={f.latex} />
                  </span>
                  <span className="search-result-meta">
                    <span className="search-result-title">{f.title}</span>
                    <span className="search-result-category" style={{ color: cat.color }}>
                      {cat.name}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
