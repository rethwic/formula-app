import type { AxialCoord } from '../types';

/**
 * Axial hex-grid math. Converting axial (q, r) directly to pixel space with
 * these formulas produces the tight circle-packing / honeycomb layout: every
 * circle sits exactly `spacing` px from each of its 6 neighbors, nestled
 * between the two circles above and below it.
 */
export function axialToPixel(coord: AxialCoord, spacing: number): { x: number; y: number } {
  const x = spacing * (coord.q + coord.r / 2);
  const y = spacing * coord.r * (Math.sqrt(3) / 2);
  return { x, y };
}

export const AXIAL_DIRECTIONS: AxialCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export function hexAdd(a: AxialCoord, b: AxialCoord): AxialCoord {
  return { q: a.q + b.q, r: a.r + b.r };
}

export function hexScale(a: AxialCoord, k: number): AxialCoord {
  return { q: a.q * k, r: a.r * k };
}

/** Returns the ring of hex cells at exactly `radius` steps from `center`. */
export function hexRing(center: AxialCoord, radius: number): AxialCoord[] {
  if (radius === 0) return [center];
  const results: AxialCoord[] = [];
  let hex = hexAdd(center, hexScale(AXIAL_DIRECTIONS[4], radius));
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < radius; j++) {
      results.push(hex);
      hex = hexAdd(hex, AXIAL_DIRECTIONS[i]);
    }
  }
  return results;
}

export function hexKey(coord: AxialCoord): string {
  return `${coord.q},${coord.r}`;
}

export function hexDistance(a: AxialCoord, b: AxialCoord): number {
  return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}
