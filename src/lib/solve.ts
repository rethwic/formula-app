// Solves residual(values) = 0 for a single unknown key, holding every other
// key at its known value. We use numeric Newton-Raphson (with a numerical
// derivative) instead of per-formula symbolic algebra: every formula only
// needs one "LHS - RHS" residual function, and the same solver then inverts
// it for whichever variable the user leaves blank, regardless of which side
// of the equation that variable started on.

const GUESSES = [1, 10, 0.1, -1, -10, 100, 0.001, 5, -5, 50, 1000, -0.1];

function newtonRaphson(
  residual: (values: Record<string, number>) => number,
  known: Record<string, number>,
  unknownKey: string,
  initialGuess: number,
  maxIter = 100,
  tol = 1e-9,
): number | null {
  let x = initialGuess;
  for (let i = 0; i < maxIter; i++) {
    const fx = residual({ ...known, [unknownKey]: x });
    if (!Number.isFinite(fx)) return null;
    if (Math.abs(fx) < tol) return x;

    const h = Math.max(1e-6, Math.abs(x) * 1e-6);
    const fPlus = residual({ ...known, [unknownKey]: x + h });
    const fMinus = residual({ ...known, [unknownKey]: x - h });
    const derivative = (fPlus - fMinus) / (2 * h);
    if (!Number.isFinite(derivative) || Math.abs(derivative) < 1e-12) return null;

    const nextX = x - fx / derivative;
    if (!Number.isFinite(nextX)) return null;
    if (Math.abs(nextX - x) < tol) return nextX;
    x = nextX;
  }
  return null;
}

export function solveForUnknown(
  residual: (values: Record<string, number>) => number,
  known: Record<string, number>,
  unknownKey: string,
): number | null {
  for (const guess of GUESSES) {
    const result = newtonRaphson(residual, known, unknownKey, guess);
    if (result !== null && Number.isFinite(result)) {
      const check = residual({ ...known, [unknownKey]: result });
      if (Math.abs(check) < 1e-6) return result;
    }
  }
  return null;
}
