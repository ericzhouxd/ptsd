/**
 * sceneStore — zustand store holding the Rank-Nullity scene's state.
 *
 * Why zustand instead of React Context or prop-drilling:
 *   The scene (a 3D Canvas, mounted as a fixed background) and the floating
 *   ControlPanel (a DOM panel pinned bottom-right) are SIBLINGS in the React
 *   tree — neither parent of the other. Lifting state up would require a
 *   common ancestor that wraps both, awkwardly. zustand gives them a shared
 *   store that either side can read or write with no extra plumbing.
 *
 *   Also: subscribing components only re-render when the slice they read
 *   changes (selectors). So when the user nudges one matrix entry, only the
 *   scene re-tweens; the dimension picker doesn't even re-render.
 *
 * State shape:
 *   n: domain dimension (2 or 3)
 *   m: codomain dimension (2 or 3)
 *   matrix: m × n number matrix (the linear map's representation)
 *
 * See LEARNING.md §"zustand".
 */
import { create } from "zustand";

export type Dim = 2 | 3;

type State = {
  n: Dim;
  m: Dim;
  matrix: number[][]; // m × n
};

type Actions = {
  setN: (n: Dim) => void;
  setM: (m: Dim) => void;
  setEntry: (row: number, col: number, value: number) => void;
  reset: () => void;
};

/**
 * Build an identity-ish matrix of given size. If m ≠ n, places 1s on the
 * leading diagonal and zeros elsewhere — gives a sensible non-degenerate
 * starting transform regardless of (n, m).
 */
function defaultMatrix(m: number, n: number): number[][] {
  return Array.from({ length: m }, (_, r) =>
    Array.from({ length: n }, (_, c) => (r === c ? 1 : 0))
  );
}

/**
 * Resize a matrix to new (m, n), preserving overlap and padding new cells
 * with identity defaults. Used when the user changes n or m so they don't
 * lose their work and don't land on an all-zeros (degenerate) matrix.
 */
function resizeMatrix(
  prev: number[][],
  prevM: number,
  prevN: number,
  newM: number,
  newN: number
): number[][] {
  const out: number[][] = [];
  for (let r = 0; r < newM; r++) {
    const row: number[] = [];
    for (let c = 0; c < newN; c++) {
      if (r < prevM && c < prevN) {
        row.push(prev[r][c]);
      } else {
        row.push(r === c ? 1 : 0);
      }
    }
    out.push(row);
  }
  return out;
}

export const useSceneStore = create<State & Actions>((set, get) => ({
  n: 2,
  m: 2,
  matrix: defaultMatrix(2, 2),

  setN: (newN) => {
    const { m, n, matrix } = get();
    if (newN === n) return;
    set({ n: newN, matrix: resizeMatrix(matrix, m, n, m, newN) });
  },
  setM: (newM) => {
    const { m, n, matrix } = get();
    if (newM === m) return;
    set({ m: newM, matrix: resizeMatrix(matrix, m, n, newM, n) });
  },
  setEntry: (row, col, value) =>
    set((s) => {
      const next = s.matrix.map((r) => r.slice());
      if (next[row]) next[row][col] = value;
      return { matrix: next };
    }),
  reset: () => set({ n: 2, m: 2, matrix: defaultMatrix(2, 2) }),
}));
