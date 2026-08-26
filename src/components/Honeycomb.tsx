import { useEffect, useMemo, useRef, useState } from 'react';
import { FormulaCard } from './FormulaCard';
import type { PositionedFormula } from './FormulaCard';
import type { Formula, PlacedFormula } from '../types';
import { assignHoneycombPositions } from '../lib/layout';
import { axialToPixel } from '../lib/hexGrid';
import { proximityBoost, clamp } from '../lib/proximity';

const CARD_DIAMETER = 116;
const CARD_SPACING = 144;
const MIN_ZOOM = 0.4;
// Capped well short of where it used to go: backdrop-filter/box-shadow blur
// radii are fixed in device pixels, not scaled by the world transform, so
// past a certain zoom the glass blur/shadow proportions read as thin or
// smeary relative to the enlarged card rather than crisp — this is the
// ceiling where everything on screen still looks sharp and intentional.
const MAX_ZOOM = 2.0;
const CLICK_MOVE_THRESHOLD = 6;
const CLICK_TIME_THRESHOLD = 500;

// Magnetic proximity-hover ripple: the card under the cursor lifts and grows
// the most; nearby cards get a smaller version of the same reaction, falling
// off smoothly with distance. Scaled in place (no repositioning), so the
// max scale + falloff radius + lift are tuned (and verified against a brute
// -force sweep over cursor position and zoom, including the vertical lift's
// effect on clearance with cards above/below) to never overlap CARD_SPACING /
// CARD_DIAMETER for any adjacent pair.
const HOVER_RADIUS = 190;
const HOVER_MAX_SCALE = 0.14;
const HOVER_MAX_LIFT = 8;
const HOVER_PEAK_THRESHOLD = 0.75;

// Search mode scales cards in place, so its scale must also stay under
// CARD_SPACING / CARD_DIAMETER or two neighboring matches could overlap.
const SEARCH_MATCH_SCALE = Math.min(1.15, (CARD_SPACING / CARD_DIAMETER) * 0.9);
const SEARCH_DIM_SCALE = 0.5;

// Subtle 3D tilt on the actively-hovered card only: it leans toward the
// cursor like a physical disc of glass catching the light, rather than a
// flat sprite scaling in place. Kept small (a few degrees, deep perspective)
// so the apparent size barely changes — verified negligible (well under a
// pixel) against the overlap-safety margins the hover ripple already keeps.
const TILT_MAX_DEG = 5;
const TILT_PERSPECTIVE = 800;

interface PointerInfo {
  x: number;
  y: number;
  pointerType: string;
}

interface EngineState {
  pan: { x: number; y: number };
  zoom: number;
  focal: { x: number; y: number };
  pointers: Map<number, PointerInfo>;
  dragging: boolean;
  dragStart: { x: number; y: number };
  panStart: { x: number; y: number };
  pinchStartDist: number;
  pinchStartZoom: number;
  pinchAnchorWorld: { x: number; y: number };
  pointerDown: { x: number; y: number; time: number } | null;
  hasMouseFocus: boolean;
}

function matchesQuery(formula: Formula, q: string): boolean {
  const hay = [
    formula.title,
    formula.label,
    formula.category,
    ...(formula.keywords ?? []),
    ...formula.variables.map((v) => `${v.symbol} ${v.meaning}`),
  ]
    .join(' ')
    .toLowerCase();
  return hay.includes(q);
}

export interface HoneycombProps {
  formulas: Formula[];
  searchQuery: string;
  onMatchCount: (n: number | null) => void;
  onSelect: (formula: PlacedFormula, rect: DOMRect) => void;
}

export function Honeycomb({ formulas, searchQuery, onMatchCount, onSelect }: HoneycombProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const rafScheduled = useRef(false);
  const matchedRef = useRef<Set<string> | null>(null);
  const [, forceRender] = useState(0);

  const engine = useRef<EngineState>({
    pan: { x: 0, y: 0 },
    zoom: 1,
    focal: { x: 0, y: 0 },
    pointers: new Map(),
    dragging: false,
    dragStart: { x: 0, y: 0 },
    panStart: { x: 0, y: 0 },
    pinchStartDist: 0,
    pinchStartZoom: 1,
    pinchAnchorWorld: { x: 0, y: 0 },
    pointerDown: null,
    hasMouseFocus: false,
  });

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

  const positioned = useMemo<PositionedFormula[]>(() => {
    const placed = assignHoneycombPositions(formulas);
    return placed.map((f) => ({ ...f, px: axialToPixel(f.pos, CARD_SPACING) }));
  }, [formulas]);

  const registerRef = (id: string, el: HTMLDivElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  };

  function applyWorldTransform() {
    const world = worldRef.current;
    if (!world) return;
    const { pan, zoom } = engine.current;
    world.style.transform = `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`;
  }

  function updateVisuals() {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const vw = rect.width;
    const vh = rect.height;
    const { pan, zoom, focal } = engine.current;
    const matched = matchedRef.current;
    const searching = matched !== null;

    const hovering = !searching && engine.current.hasMouseFocus;

    for (const f of positioned) {
      const el = cardRefs.current.get(f.id);
      if (!el) continue;
      const screenX = vw / 2 + pan.x + zoom * f.px.x;
      const screenY = vh / 2 + pan.y + zoom * f.px.y;

      let scale = 1;
      let liftY = 0;
      let opacity = 1;
      let zIndex = 0;
      let isPeak = false;
      let rotateX = 0;
      let rotateY = 0;

      if (searching) {
        // Search overrides the magnetic ripple entirely: prominence comes
        // from a fixed, overlap-safe scale + opacity split, not proximity to
        // the pointer.
        const isMatch = matched!.has(f.id);
        scale = isMatch ? SEARCH_MATCH_SCALE : SEARCH_DIM_SCALE;
        opacity = isMatch ? 1 : 0.18;
      } else if (hovering) {
        // Lens radius grows with zoom, in lockstep with card size (both
        // scale with `zoom`), so the ripple's reach feels consistent — a
        // handful of cards around the cursor — at any zoom level.
        const dx = screenX - focal.x;
        const dy = screenY - focal.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const boost = proximityBoost(dist, HOVER_RADIUS * zoom);
        scale = 1 + HOVER_MAX_SCALE * boost;
        liftY = -HOVER_MAX_LIFT * boost;
        zIndex = Math.round(boost * 100);
        isPeak = boost > HOVER_PEAK_THRESHOLD;

        // Only the single peak card tilts — a perspective+rotate transform
        // on every card would be wasted work for no visible benefit, since
        // the effect is only really legible on the one thing you're
        // actually pointing at.
        if (isPeak && !prefersReducedMotion.current) {
          const cardScreenRadius = Math.max(1, (CARD_DIAMETER / 2) * scale * zoom);
          const nx = clamp(-dx / cardScreenRadius, -1, 1);
          const ny = clamp(-dy / cardScreenRadius, -1, 1);
          rotateY = nx * TILT_MAX_DEG;
          rotateX = -ny * TILT_MAX_DEG;
        }
      }

      const tilt =
        rotateX !== 0 || rotateY !== 0
          ? `perspective(${TILT_PERSPECTIVE}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) `
          : '';
      el.style.transform = `translate(-50%, -50%) translateY(${liftY}px) ${tilt}scale(${scale})`;
      el.style.opacity = String(opacity);
      el.style.zIndex = String(zIndex);
      el.classList.toggle('is-peak', isPeak);
      el.classList.toggle('is-dimmed', searching && !matched!.has(f.id));
    }
  }

  function scheduleUpdate() {
    if (rafScheduled.current) return;
    rafScheduled.current = true;
    requestAnimationFrame(() => {
      rafScheduled.current = false;
      applyWorldTransform();
      updateVisuals();
    });
  }

  function animatePanTo(target: { x: number; y: number }, duration = 550) {
    if (prefersReducedMotion.current) {
      engine.current.pan = { ...target };
      scheduleUpdate();
      return;
    }
    const start = { ...engine.current.pan };
    const startTime = performance.now();
    function step(now: number) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      engine.current.pan = {
        x: start.x + (target.x - start.x) * eased,
        y: start.y + (target.y - start.y) * eased,
      };
      applyWorldTransform();
      updateVisuals();
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Search: compute matches, boost their visibility, and pan to bring them
  // into view without requiring the user to hunt for them manually.
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      matchedRef.current = null;
      onMatchCount(null);
      scheduleUpdate();
      return;
    }
    const matches = positioned.filter((f) => matchesQuery(f, q));
    matchedRef.current = new Set(matches.map((f) => f.id));
    onMatchCount(matches.length);
    if (matches.length > 0) {
      const cx = matches.reduce((s, f) => s + f.px.x, 0) / matches.length;
      const cy = matches.reduce((s, f) => s + f.px.y, 0) / matches.length;
      const { zoom } = engine.current;
      animatePanTo({ x: -zoom * cx, y: -zoom * cy });
    } else {
      scheduleUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, positioned]);

  // On first mount, zoom/pan to fill the viewport with the cluster (cover
  // semantics, like background-size: cover) so there's no empty margin on
  // the initial load — then just re-render on resize without re-fitting, so
  // it doesn't yank the view out from under a user who has since panned or
  // zoomed manually.
  useEffect(() => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (rect && rect.width > 0 && rect.height > 0 && positioned.length > 0) {
      const r = CARD_DIAMETER / 2;
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (const f of positioned) {
        minX = Math.min(minX, f.px.x - r);
        maxX = Math.max(maxX, f.px.x + r);
        minY = Math.min(minY, f.px.y - r);
        maxY = Math.max(maxY, f.px.y + r);
      }
      const boundWidth = maxX - minX;
      const boundHeight = maxY - minY;
      const boundCenterX = (minX + maxX) / 2;
      const boundCenterY = (minY + maxY) / 2;
      const overscan = 1.08;
      const fitZoom = Math.max(rect.width / boundWidth, rect.height / boundHeight) * overscan;
      const zoom = clamp(fitZoom, MIN_ZOOM, MAX_ZOOM);
      engine.current.zoom = zoom;
      engine.current.pan = { x: -zoom * boundCenterX, y: -zoom * boundCenterY };
    }
    scheduleUpdate();
    const onResize = () => scheduleUpdate();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getViewportPoint(clientX: number, clientY: number) {
    const rect = viewportRef.current!.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function worldPointUnderScreen(sx: number, sy: number) {
    const rect = viewportRef.current!.getBoundingClientRect();
    const { pan, zoom } = engine.current;
    return {
      x: (sx - rect.width / 2 - pan.x) / zoom,
      y: (sy - rect.height / 2 - pan.y) / zoom,
    };
  }

  function handlePointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const pt = getViewportPoint(e.clientX, e.clientY);
    engine.current.pointers.set(e.pointerId, { x: pt.x, y: pt.y, pointerType: e.pointerType });

    if (engine.current.pointers.size === 1) {
      engine.current.dragging = true;
      engine.current.dragStart = { x: pt.x, y: pt.y };
      engine.current.panStart = { ...engine.current.pan };
      engine.current.pointerDown = { x: pt.x, y: pt.y, time: performance.now() };
      if (e.pointerType === 'mouse') {
        engine.current.hasMouseFocus = true;
        engine.current.focal = pt;
      }
    } else if (engine.current.pointers.size === 2) {
      engine.current.dragging = false;
      const pts = Array.from(engine.current.pointers.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      engine.current.pinchStartDist = dist;
      engine.current.pinchStartZoom = engine.current.zoom;
      engine.current.pinchAnchorWorld = worldPointUnderScreen(mid.x, mid.y);
    }
    scheduleUpdate();
  }

  function handlePointerMove(e: React.PointerEvent) {
    const pt = getViewportPoint(e.clientX, e.clientY);

    if (e.pointerType === 'mouse' && engine.current.pointers.size === 0) {
      engine.current.hasMouseFocus = true;
      engine.current.focal = pt;
      scheduleUpdate();
      return;
    }

    if (!engine.current.pointers.has(e.pointerId)) return;
    engine.current.pointers.set(e.pointerId, { x: pt.x, y: pt.y, pointerType: e.pointerType });

    if (e.pointerType === 'mouse') {
      engine.current.focal = pt;
    }

    if (engine.current.pointers.size === 2) {
      const pts = Array.from(engine.current.pointers.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      const newZoom = clamp(
        engine.current.pinchStartZoom * (dist / Math.max(1, engine.current.pinchStartDist)),
        MIN_ZOOM,
        MAX_ZOOM,
      );
      const rect = viewportRef.current!.getBoundingClientRect();
      engine.current.zoom = newZoom;
      engine.current.pan = {
        x: mid.x - rect.width / 2 - newZoom * engine.current.pinchAnchorWorld.x,
        y: mid.y - rect.height / 2 - newZoom * engine.current.pinchAnchorWorld.y,
      };
      scheduleUpdate();
    } else if (engine.current.dragging) {
      const dx = pt.x - engine.current.dragStart.x;
      const dy = pt.y - engine.current.dragStart.y;
      engine.current.pan = {
        x: engine.current.panStart.x + dx,
        y: engine.current.panStart.y + dy,
      };
      scheduleUpdate();
    } else {
      scheduleUpdate();
    }
  }

  function handlePointerUp(e: React.PointerEvent) {
    const pt = getViewportPoint(e.clientX, e.clientY);
    const wasSinglePointer = engine.current.pointers.size === 1;
    engine.current.pointers.delete(e.pointerId);

    if (wasSinglePointer && engine.current.pointerDown) {
      const { x, y, time } = engine.current.pointerDown;
      const moved = Math.hypot(pt.x - x, pt.y - y);
      const elapsed = performance.now() - time;
      if (moved < CLICK_MOVE_THRESHOLD && elapsed < CLICK_TIME_THRESHOLD) {
        const cardEl = (e.target as HTMLElement).closest<HTMLElement>('[data-card-id]');
        if (cardEl) {
          const id = cardEl.dataset.cardId!;
          const formula = positioned.find((f) => f.id === id);
          if (formula) onSelect(formula, cardEl.getBoundingClientRect());
        }
      }
    }

    if (engine.current.pointers.size === 1) {
      const remaining = Array.from(engine.current.pointers.entries())[0];
      engine.current.dragging = true;
      engine.current.dragStart = { x: remaining[1].x, y: remaining[1].y };
      engine.current.panStart = { ...engine.current.pan };
    } else if (engine.current.pointers.size === 0) {
      engine.current.dragging = false;
      engine.current.pointerDown = null;
    }
    scheduleUpdate();
  }

  function handlePointerLeave(e: React.PointerEvent) {
    if (e.pointerType === 'mouse' && engine.current.pointers.size === 0) {
      const rect = viewportRef.current!.getBoundingClientRect();
      engine.current.hasMouseFocus = false;
      engine.current.focal = { x: rect.width / 2, y: rect.height / 2 };
      scheduleUpdate();
    }
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault();
    const pt = getViewportPoint(e.clientX, e.clientY);
    const rect = viewportRef.current!.getBoundingClientRect();
    const worldPt = worldPointUnderScreen(pt.x, pt.y);
    const delta = -e.deltaY * 0.0016;
    const newZoom = clamp(engine.current.zoom * (1 + delta), MIN_ZOOM, MAX_ZOOM);
    engine.current.zoom = newZoom;
    engine.current.pan = {
      x: pt.x - rect.width / 2 - newZoom * worldPt.x,
      y: pt.y - rect.height / 2 - newZoom * worldPt.y,
    };
    engine.current.focal = pt;
    scheduleUpdate();
  }

  useEffect(() => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (rect) engine.current.focal = { x: rect.width / 2, y: rect.height / 2 };
    forceRender((n) => n + 1);
  }, []);

  // React's synthetic onWheel is passive by default, which silently makes
  // preventDefault() a no-op. Attach a native listener so trackpad pinch and
  // ctrl+scroll zoom the honeycomb instead of zooming the page.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={viewportRef}
      className="honeycomb-viewport"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      <div ref={worldRef} className="honeycomb-world">
        {positioned.map((f) => (
          <FormulaCard key={f.id} formula={f} registerRef={registerRef} />
        ))}
      </div>
    </div>
  );
}
