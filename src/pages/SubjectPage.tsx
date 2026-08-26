import { Link, Navigate, useParams } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { FormulaGridCard } from '../components/FormulaGridCard';
import { GlobalSearch } from '../components/GlobalSearch';
import { subjects, subjectMap } from '../data/subjects';
import { categoryMap } from '../data/categories';
import { formulas } from '../data/formulas';
import { useDetail } from '../context/DetailContext';
import type { SubjectId } from '../types';

export function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { openDetail } = useDetail();

  const subject = subjectId ? subjectMap[subjectId as SubjectId] : undefined;
  if (!subject) return <Navigate to="/" replace />;

  const style = { '--cat-color': subject.color, '--cat-soft': subject.colorSoft } as CSSProperties;

  return (
    <div className="subject-page">
      <header className="subject-page-header">
        <Link to="/" className="subject-page-home glass">
          ← Derive
        </Link>
        <div className="subject-switcher">
          {subjects.map((s) => (
            <Link
              key={s.id}
              to={`/${s.id}`}
              className={`subject-pill${s.id === subject.id ? ' subject-pill-active' : ''}`}
              style={{ '--cat-color': s.color } as CSSProperties}
            >
              {s.name}
            </Link>
          ))}
        </div>
        <div className="subject-page-search">
          <GlobalSearch />
        </div>
      </header>

      <div className="subject-page-title" style={style}>
        <h1>{subject.name}</h1>
        <p>{subject.tagline}</p>
      </div>

      {subject.categories.map((categoryId) => {
        const cat = categoryMap[categoryId];
        const items = formulas.filter((f) => f.category === categoryId);
        if (items.length === 0) return null;
        return (
          <section key={categoryId} className="category-section">
            <h2 className="category-heading" style={{ '--cat-color': cat.color } as CSSProperties}>
              {cat.name}
            </h2>
            <div className="formula-grid">
              {items.map((f) => (
                <FormulaGridCard key={f.id} formula={f} onClick={openDetail} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
