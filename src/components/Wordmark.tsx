import { useEffect, useRef } from 'react';
import { proximityBoost, clamp } from '../lib/proximity';
import { categories } from '../data/categories';

const WORD = 'Derive';
const HOVER_RADIUS = 150;
const MAX_SCALE = 0.22;
const MAX_LIFT = 14;
const MAX_TILT_DEG = 9;
const PERSPECTIVE = 700;

export function Wordmark() {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafScheduled = useRef(false);
  const focal = useRef<{ x: number; y: number } | null>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mq.matches;
    const onChange = () => {
      prefersReducedMotion.current = mq.matches;
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  function update() {
    const container = containerRef.current;
    if (!container) return;
    const f = focal.current;

    letterRefs.current.forEach((el) => {
      if (!el) return;
      if (!f || prefersReducedMotion.current) {
        el.style.transform = '';
        el.style.zIndex = '0';
        el.style.boxShadow = '';
        return;
      }
      const rect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - containerRect.left;
      const cy = rect.top + rect.height / 2 - containerRect.top;
      const dx = f.x - cx;
      const dy = f.y - cy;
      const dist = Math.hypot(dx, dy);
      const boost = proximityBoost(dist, HOVER_RADIUS);

      const scale = 1 + MAX_SCALE * boost;
      const lift = -MAX_LIFT * boost;
      const nx = clamp(dx / HOVER_RADIUS, -1, 1);
      const ny = clamp(dy / HOVER_RADIUS, -1, 1);
      const rotateY = nx * MAX_TILT_DEG * boost;
      const rotateX = -ny * MAX_TILT_DEG * boost;

      el.style.transform = `translateY(${lift}px) perspective(${PERSPECTIVE}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
      el.style.zIndex = String(Math.round(boost * 100));
      el.style.boxShadow = boost > 0.05 ? `0 ${18 * boost}px ${34 * boost}px rgba(60, 64, 90, ${0.16 + 0.14 * boost})` : '';
    });
  }

  function scheduleUpdate() {
    if (rafScheduled.current) return;
    rafScheduled.current = true;
    requestAnimationFrame(() => {
      rafScheduled.current = false;
      update();
    });
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (e.pointerType !== 'mouse') return;
    const rect = containerRef.current!.getBoundingClientRect();
    focal.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    scheduleUpdate();
  }

  function handlePointerLeave() {
    focal.current = null;
    scheduleUpdate();
  }

  return (
    <div
      ref={containerRef}
      className="wordmark"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {WORD.split('').map((letter, i) => {
        const cat = categories[i % categories.length];
        return (
          <div
            key={i}
            className="wm-letter-wrap"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div
              ref={(el) => {
                letterRefs.current[i] = el;
              }}
              className="wm-letter glass"
              style={{ '--cat-soft': cat.colorSoft } as React.CSSProperties}
            >
              {letter}
            </div>
          </div>
        );
      })}
    </div>
  );
}
