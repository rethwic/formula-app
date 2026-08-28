import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MIN_SCALE, MAX_SCALE } from '../context/WorkspaceContext';

interface WorkspaceZoomPopoverProps {
  scale: number;
  onChange: (scale: number) => void;
  onClose: () => void;
}

// Revealed by pressing and holding the resize/fit icon — a manual slider
// for precise zoom, as an alternative to the icon's single-click "smart
// fit" action and to scroll/pinch on the canvas itself.
export function WorkspaceZoomPopover({ scale, onChange, onClose }: WorkspaceZoomPopoverProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const percent = Math.round(scale * 100);
  const fill = ((scale - MIN_SCALE) / (MAX_SCALE - MIN_SCALE)) * 100;

  return (
    <motion.div
      ref={rootRef}
      className="workspace-zoom-popover glass"
      role="group"
      aria-label="Manual zoom"
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: 'spring', damping: 28, stiffness: 340 }}
    >
      <input
        type="range"
        className="workspace-zoom-slider"
        style={{ ['--fill' as string]: `${fill}%` }}
        min={Math.round(MIN_SCALE * 100)}
        max={Math.round(MAX_SCALE * 100)}
        value={percent}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        aria-label="Zoom level"
      />
      <span className="workspace-zoom-popover-label">{percent}%</span>
    </motion.div>
  );
}
