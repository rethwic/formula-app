import { Link } from 'react-router-dom';
import { SymbolGrid } from '../components/SymbolGrid';
import { GlobalSearch } from '../components/GlobalSearch';
import { SubjectCard } from '../components/SubjectCard';
import { subjects } from '../data/subjects';

export function LandingPage() {
  return (
    <>
      <SymbolGrid />
      <Link to="/workspace" className="landing-workspace-link subject-page-home glass">
        Workspace
      </Link>
      <div className="landing-page">
        <div className="landing-hero">
          <h1 className="landing-title">Derive</h1>
        </div>

        <div className="landing-search-group">
          <GlobalSearch />
          <div className="subject-grid">
            {subjects.map((s) => (
              <SubjectCard key={s.id} subject={s} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
