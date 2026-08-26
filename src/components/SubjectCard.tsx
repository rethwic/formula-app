import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import type { Subject } from '../types';
import { formulas } from '../data/formulas';

export function SubjectCard({ subject }: { subject: Subject }) {
  const count = formulas.filter((f) => subject.categories.includes(f.category)).length;
  const style = {
    '--cat-color': subject.color,
    '--cat-soft': subject.colorSoft,
  } as CSSProperties;

  return (
    <Link to={`/${subject.id}`} className="subject-card glass" style={style}>
      <span className="subject-card-name">{subject.name}</span>
      <span className="subject-card-tagline">{subject.tagline}</span>
      <span className="subject-card-count">{count} formulas</span>
    </Link>
  );
}
