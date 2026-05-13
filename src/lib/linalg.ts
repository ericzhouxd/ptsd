/**
 * linalg.ts — minimal linear algebra for n, m ≤ 3.
 *
 * Hand-rolled rather than pulled from mathjs because:
 *   • The matrices are tiny (≤ 3×3)
 *   • mathjs has no first-class nullSpace; we'd write RREF anyway
 *   • Keeping it ~80 LOC means you can read the whole algorithm
 *
 * Functions:
 *   rref(M)                  → reduced row echelon form + list of pivot column indices
 *   rank(M)                  → number of pivots
 *   columnSpaceBasis(M)      → array of column vectors of the ORIGINAL M at pivot positions
 *   nullSpaceBasis(M)        → array of basis vectors for ker(M), padded to length 3
 *
 * Numerical hygiene: a matrix entry is treated as zero if |x| < EPS. Without
 * this, typing "0.000001" makes a tiny pivot and the null-space dimension
 * flickers as the user types.
 */

const EPS = 1e-9;

type Matrix = number[][];

/**
 * Compute reduced row echelon form. Returns a NEW matrix (does not mutate input)
 * plus the list of column indices that are pivots in the RREF.
 */
export function rref(input: Matrix): { rref: Matrix; pivots: number[] } {
  const m = input.length;
  if (m === 0) return { rref: [], pivots: [] };
  const n = input[0].length;
  const M: Matrix = input.map((row) => row.slice());
  const pivots: number[] = [];

  let pivotRow = 0;
  for (let col = 0; col < n && pivotRow < m; col++) {
    // Find the row at or below pivotRow with the largest |M[r][col]| (partial pivoting)
    let bestRow = pivotRow;
    let bestVal = Math.abs(M[pivotRow][col]);
    for (let r = pivotRow + 1; r < m; r++) {
      if (Math.abs(M[r][col]) > bestVal) {
        bestVal = Math.abs(M[r][col]);
        bestRow = r;
      }
    }
    if (bestVal < EPS) continue; // no pivot in this column

    // Swap into pivot position
    if (bestRow !== pivotRow) {
      [M[pivotRow], M[bestRow]] = [M[bestRow], M[pivotRow]];
    }

    // Normalize pivot row
    const pivotVal = M[pivotRow][col];
    for (let c = 0; c < n; c++) M[pivotRow][c] /= pivotVal;

    // Eliminate this column in every other row (above and below)
    for (let r = 0; r < m; r++) {
      if (r === pivotRow) continue;
      const factor = M[r][col];
      if (Math.abs(factor) < EPS) continue;
      for (let c = 0; c < n; c++) {
        M[r][c] -= factor * M[pivotRow][c];
      }
    }

    pivots.push(col);
    pivotRow++;
  }

  // Snap near-zero entries to zero for cleanliness
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (Math.abs(M[r][c]) < EPS) M[r][c] = 0;
    }
  }

  return { rref: M, pivots };
}

export function rank(M: Matrix): number {
  return rref(M).pivots.length;
}

/**
 * Column space basis = the pivot columns of the ORIGINAL matrix M.
 * Each returned vector is padded to length 3 (z=0 if not present).
 */
export function columnSpaceBasis(M: Matrix): [number, number, number][] {
  if (M.length === 0) return [];
  const { pivots } = rref(M);
  const m = M.length;
  return pivots.map((col) => {
    const v: [number, number, number] = [0, 0, 0];
    for (let r = 0; r < m && r < 3; r++) v[r] = M[r][col];
    return v;
  });
}

/**
 * Null space basis. For each FREE column (not a pivot), construct a vector
 * by setting that free variable to 1, other free variables to 0, and solving
 * for the pivot variables from the RREF.
 *
 * Returns vectors in domain space (R^n), padded to length 3.
 */
export function nullSpaceBasis(M: Matrix): [number, number, number][] {
  if (M.length === 0) return [];
  const n = M[0].length;
  const { rref: R, pivots } = rref(M);
  const pivotSet = new Set(pivots);
  const freeCols: number[] = [];
  for (let c = 0; c < n; c++) if (!pivotSet.has(c)) freeCols.push(c);

  return freeCols.map((freeCol) => {
    const v = new Array(n).fill(0);
    v[freeCol] = 1;
    // For each pivot row, the corresponding pivot variable equals
    // -sum_{c is free} R[pivotRow][c] * v[c]
    pivots.forEach((pivotCol, pivotRow) => {
      let sum = 0;
      for (const c of freeCols) sum += R[pivotRow][c] * v[c];
      v[pivotCol] = -sum;
    });
    const out: [number, number, number] = [0, 0, 0];
    for (let i = 0; i < n && i < 3; i++) out[i] = v[i];
    return out;
  });
}
