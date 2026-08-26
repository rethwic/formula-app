import ParticleText from '../components/ParticleText';
import { GlobalSearch } from '../components/GlobalSearch';
import { SubjectCard } from '../components/SubjectCard';
import { subjects } from '../data/subjects';

export function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-hero">
        <ParticleText
          text="Derive"
          particleSize={2.1}
          density={3}
          color="#1c1c1e"
          highlightColor="#0a84ff"
          scatter={170}
          gatherDuration={1400}
          stagger={380}
          pointerRepel={34}
          repelRadius={110}
          idleDrift={0.5}
          trigger="hover"
          fontSize="clamp(3.5rem, 13vw, 9rem)"
          fontWeight={800}
          fontFamily="inherit"
          glow
        />
      </div>

      <div className="landing-bottom-bar">
        <GlobalSearch />
        <div className="subject-grid">
          {subjects.map((s) => (
            <SubjectCard key={s.id} subject={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
