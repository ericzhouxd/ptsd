/**
 * MatrixInput — an m × n grid of number inputs for editing the matrix M.
 *
 * Each column represents one column vector of M (a vector in the codomain).
 * Number inputs are chosen over sliders (which would eat space at 3×3 = 9
 * cells) and over text fields (which need parsing/validation). Arrow keys
 * nudge by `step`; the scene springs to the new value on every keystroke.
 *
 * Concepts demonstrated:
 *   • zustand selectors: we subscribe ONLY to (n, m, matrix) so unrelated
 *     state changes don't re-render this component.
 *   • Controlled inputs: each <input>'s `value` is read from the store; the
 *     onChange handler writes back via setEntry.
 */
"use client";

import { useSceneStore } from "./sceneStore";

export function MatrixInput() {
  const n = useSceneStore((s) => s.n);
  const m = useSceneStore((s) => s.m);
  const matrix = useSceneStore((s) => s.matrix);
  const setEntry = useSceneStore((s) => s.setEntry);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <span className="text-fg-muted text-xs">M =</span>
      </div>
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: m }).map((_, r) =>
          Array.from({ length: n }).map((_, c) => (
            <input
              key={`${r}-${c}`}
              type="number"
              step={0.1}
              value={Number.isFinite(matrix[r]?.[c]) ? matrix[r][c] : 0}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setEntry(r, c, Number.isFinite(v) ? v : 0);
              }}
              className="h-8 w-14 rounded-md bg-glass-bg/60 border border-glass-border px-2 text-sm text-fg text-center font-mono focus:outline-none focus:border-yellow/60 transition-colors"
            />
          ))
        )}
      </div>
    </div>
  );
}
