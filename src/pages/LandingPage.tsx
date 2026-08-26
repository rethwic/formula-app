import { Wordmark } from '../components/Wordmark';
import { GlobalSearch } from '../components/GlobalSearch';
import { SubjectCard } from '../components/SubjectCard';
import { subjects } from '../data/subjects';

export function LandingPage() {
  return (
    <div className="landing-page">
      <Wordmark />
      <GlobalSearch />
      <div className="subject-grid">
        {subjects.map((s) => (
          <SubjectCard key={s.id} subject={s} />
        ))}
      </div>
    </div>
  );
}
