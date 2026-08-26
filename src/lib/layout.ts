import type { CategoryId, Formula, PlacedFormula } from '../types';
import { categories } from '../data/categories';
import { AXIAL_DIRECTIONS, hexKey, hexRing } from './hexGrid';

const HUB_ANCHOR_DISTANCE = 2;

/**
 * Arranges formulas into a honeycomb "cluster" shape: one petal per category
 * growing outward ring-by-ring from an anchor near (but not reserving) the
 * origin. Cells already claimed by a neighboring petal are skipped, so
 * petals interlock without overlapping as they grow. The origin itself is
 * left unreserved so the first petal to reach it (via its own ring growth)
 * fills it — there's no permanently empty hub cell in the middle.
 */
export function assignHoneycombPositions(allFormulas: Formula[]): PlacedFormula[] {
  const occupied = new Set<string>();

  const placed: PlacedFormula[] = [];
  const byCategory = new Map<CategoryId, Formula[]>();
  for (const f of allFormulas) {
    if (!byCategory.has(f.category)) byCategory.set(f.category, []);
    byCategory.get(f.category)!.push(f);
  }

  categories.forEach((cat, i) => {
    const items = byCategory.get(cat.id) ?? [];
    if (items.length === 0) return;
    const dir = AXIAL_DIRECTIONS[i % AXIAL_DIRECTIONS.length];
    const anchor = { q: dir.q * HUB_ANCHOR_DISTANCE, r: dir.r * HUB_ANCHOR_DISTANCE };

    let ring = 0;
    let idx = 0;
    let safety = 0;
    while (idx < items.length && safety < 1000) {
      safety++;
      const ringCells = hexRing(anchor, ring);
      for (const cell of ringCells) {
        const key = hexKey(cell);
        if (occupied.has(key)) continue;
        occupied.add(key);
        placed.push({ ...items[idx], pos: cell });
        idx++;
        if (idx >= items.length) break;
      }
      ring++;
    }
  });

  return placed;
}
