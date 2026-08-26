interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  matchCount: number | null;
}

export function SearchBar({ value, onChange, matchCount }: SearchBarProps) {
  return (
    <div className="search-bar glass">
      <svg className="search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search formulas, symbols, topics…"
        spellCheck={false}
        autoComplete="off"
      />
      {value && (
        <>
          <span className="search-count">{matchCount ?? 0} found</span>
          <button
            type="button"
            className="search-clear"
            aria-label="Clear search"
            onClick={() => onChange('')}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
}
