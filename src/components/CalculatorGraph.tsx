import { useEffect, useRef } from 'react';

export interface GraphCurve {
  id: string;
  color: string;
  // A plain numeric function — the panel has already bound whatever scope
  // (slider values, the row's own parameter name) it needs into this
  // closure, so the graph itself doesn't need to know anything about
  // mathjs or expression scopes at all.
  evaluate: (x: number) => number;
}

export interface GraphVertical {
  id: string;
  color: string;
  x: number;
}

interface CalculatorGraphProps {
  curves: GraphCurve[];
  verticals: GraphVertical[];
}

interface View {
  cx: number;
  cy: number;
  /** World units represented by one CSS pixel — smaller means more zoomed in. */
  unitsPerPx: number;
}

const MIN_UNITS_PER_PX = 0.0004;
const MAX_UNITS_PER_PX = 60;
const DEFAULT_VIEW: View = { cx: 0, cy: 0, unitsPerPx: 0.045 };
const FONT = '11px Inter, -apple-system, BlinkMacSystemFont, sans-serif';

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Rounds a raw "world units per grid line" value to a clean 1/2/5 * 10^n
// step so grid lines land on nice numbers at any zoom level.
function niceStep(rawStep: number): number {
  const exponent = Math.floor(Math.log10(rawStep));
  const base = rawStep / 10 ** exponent;
  const niceBase = base < 1.5 ? 1 : base < 3 ? 2 : base < 7 ? 5 : 10;
  return niceBase * 10 ** exponent;
}

function formatTick(value: number, step: number): string {
  if (Math.abs(value) < step / 1000) return '0';
  const decimals = Math.max(0, -Math.floor(Math.log10(step)));
  return value.toFixed(decimals);
}

function draw(
  ctx: CanvasRenderingContext2D,
  cssW: number,
  cssH: number,
  view: View,
  curves: GraphCurve[],
  verticals: GraphVertical[],
) {
  ctx.clearRect(0, 0, cssW, cssH);

  const { cx, cy, unitsPerPx } = view;
  const toScreenX = (wx: number) => cssW / 2 + (wx - cx) / unitsPerPx;
  const toScreenY = (wy: number) => cssH / 2 - (wy - cy) / unitsPerPx;
  const toWorldX = (sx: number) => cx + (sx - cssW / 2) * unitsPerPx;
  const toWorldY = (sy: number) => cy - (sy - cssH / 2) * unitsPerPx;

  const step = niceStep(70 * unitsPerPx);
  const minX = toWorldX(0);
  const maxX = toWorldX(cssW);
  const minY = toWorldY(cssH);
  const maxY = toWorldY(0);

  // Grid
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(28, 28, 30, 0.08)';
  ctx.beginPath();
  for (let i = Math.ceil(minX / step); i * step <= maxX; i++) {
    const sx = Math.round(toScreenX(i * step)) + 0.5;
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, cssH);
  }
  for (let j = Math.ceil(minY / step); j * step <= maxY; j++) {
    const sy = Math.round(toScreenY(j * step)) + 0.5;
    ctx.moveTo(0, sy);
    ctx.lineTo(cssW, sy);
  }
  ctx.stroke();

  // Axes
  const axisX = toScreenX(0);
  const axisY = toScreenY(0);
  ctx.strokeStyle = 'rgba(28, 28, 30, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (axisX >= 0 && axisX <= cssW) {
    ctx.moveTo(Math.round(axisX) + 0.5, 0);
    ctx.lineTo(Math.round(axisX) + 0.5, cssH);
  }
  if (axisY >= 0 && axisY <= cssH) {
    ctx.moveTo(0, Math.round(axisY) + 0.5);
    ctx.lineTo(cssW, Math.round(axisY) + 0.5);
  }
  ctx.stroke();

  // Tick labels — pinned to whichever screen edge is closer when the axis
  // itself has been panned out of view, so numbers stay legible.
  ctx.font = FONT;
  ctx.fillStyle = 'rgba(28, 28, 30, 0.55)';
  const labelY = clamp(axisY, 12, cssH - 6);
  const labelX = clamp(axisX, 4, cssW - 28);
  ctx.textBaseline = 'top';
  for (let i = Math.ceil(minX / step); i * step <= maxX; i++) {
    if (i === 0) continue;
    const sx = toScreenX(i * step);
    ctx.fillText(formatTick(i * step, step), sx + 3, labelY + 3);
  }
  ctx.textBaseline = 'bottom';
  for (let j = Math.ceil(minY / step); j * step <= maxY; j++) {
    if (j === 0) continue;
    const sy = toScreenY(j * step);
    ctx.fillText(formatTick(j * step, step), labelX + 3, sy - 2);
  }

  // Vertical lines (x = constant rows)
  for (const v of verticals) {
    const sx = toScreenX(v.x);
    if (sx < -1 || sx > cssW + 1) continue;
    ctx.strokeStyle = v.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, cssH);
    ctx.stroke();
  }

  // Curves — sampled one world-x per device pixel column, breaking the
  // path on non-finite results or on a huge jump (an asymptote, e.g.
  // tan(x)) so branches don't get connected by a stray near-vertical line.
  for (const curve of curves) {
    ctx.strokeStyle = curve.color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    let drawing = false;
    let prevSy: number | null = null;
    for (let sx = 0; sx <= cssW; sx++) {
      const wx = toWorldX(sx);
      const wy = curve.evaluate(wx);
      if (!Number.isFinite(wy)) {
        drawing = false;
        prevSy = null;
        continue;
      }
      const sy = toScreenY(wy);
      if (!drawing || (prevSy !== null && Math.abs(sy - prevSy) > cssH * 4)) {
        ctx.moveTo(sx, sy);
        drawing = true;
      } else {
        ctx.lineTo(sx, sy);
      }
      prevSy = sy;
    }
    ctx.stroke();
  }
}

export function CalculatorGraph({ curves, verticals }: CalculatorGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<View>({ ...DEFAULT_VIEW });
  const dataRef = useRef({ curves, verticals });
  dataRef.current = { curves, verticals };
  const dragRef = useRef<{ startX: number; startY: number; origin: View } | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  function redraw() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(ctx, w, h, viewRef.current, dataRef.current.curves, dataRef.current.verticals);
  }

  useEffect(() => {
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curves, verticals]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      sizeRef.current = { w: width, h: height };
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      redraw();
    });
    observer.observe(container);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A manual, non-passive wheel listener — React's default passive
  // listener silently ignores preventDefault(), which would otherwise let
  // scrolling over the graph also scroll/zoom the surrounding page.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const rect = container!.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const view = viewRef.current;
      const worldX = view.cx + (sx - rect.width / 2) * view.unitsPerPx;
      const worldY = view.cy - (sy - rect.height / 2) * view.unitsPerPx;
      const factor = Math.exp(-e.deltaY * 0.0015);
      const newUnitsPerPx = clamp(view.unitsPerPx / factor, MIN_UNITS_PER_PX, MAX_UNITS_PER_PX);
      viewRef.current = {
        unitsPerPx: newUnitsPerPx,
        cx: worldX - (sx - rect.width / 2) * newUnitsPerPx,
        cy: worldY + (sy - rect.height / 2) * newUnitsPerPx,
      };
      redraw();
    }
    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // A pointer id that isn't currently active can reject capture in some
      // browsers — harmless to skip, dragging still works via the regular
      // pointermove/pointerup below.
    }
    dragRef.current = { startX: e.clientX, startY: e.clientY, origin: viewRef.current };
  }

  function handlePointerMove(e: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag) return;
    const { unitsPerPx } = drag.origin;
    viewRef.current = {
      unitsPerPx,
      cx: drag.origin.cx - (e.clientX - drag.startX) * unitsPerPx,
      cy: drag.origin.cy + (e.clientY - drag.startY) * unitsPerPx,
    };
    redraw();
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  function resetView() {
    viewRef.current = { ...DEFAULT_VIEW };
    redraw();
  }

  return (
    <div ref={containerRef} className="calculator-graph">
      <canvas
        ref={canvasRef}
        className="calculator-graph-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <button type="button" className="calculator-graph-home" aria-label="Reset view" onClick={resetView}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 11.5L12 4l8 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 10v9a1 1 0 001 1h3v-6h4v6h3a1 1 0 001-1v-9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
