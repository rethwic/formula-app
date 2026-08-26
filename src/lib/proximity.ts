/**
 * Smooth (Gaussian) falloff for the magnetic proximity-hover ripple: 1 right
 * under the cursor, easing down to 0 by `radius`, rather than a hard cutoff
 * or a linear ramp.
 */
export function proximityBoost(distance: number, radius: number): number {
  const sigma = radius / 2.1;
  return Math.exp(-(distance * distance) / (2 * sigma * sigma));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
