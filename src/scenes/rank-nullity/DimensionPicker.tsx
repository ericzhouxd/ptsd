/**
 * DimensionPicker — toggle the domain dim (n) and codomain dim (m) between 2 and 3.
 *
 * Changing a dimension resizes the matrix in the store (preserving overlap,
 * padding new cells with identity defaults). The scene re-renders with the
 * new geometry; the matrix input grid resizes too.
 */
"use client";

import { useSceneStore, type Dim } from "./sceneStore";

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Dim;
  onChange: (d: Dim) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-fg-muted text-xs w-3">{label}</span>
      <div className="inline-flex rounded-md border border-glass-border overflow-hidden">
        {([2, 3] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onChange(d)}
            className={
              value === d
                ? "bg-yellow/15 text-yellow px-2.5 py-1 text-xs font-mono"
                : "text-fg-muted hover:text-fg px-2.5 py-1 text-xs font-mono transition-colors"
            }
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DimensionPicker() {
  const n = useSceneStore((s) => s.n);
  const m = useSceneStore((s) => s.m);
  const setN = useSceneStore((s) => s.setN);
  const setM = useSceneStore((s) => s.setM);

  return (
    <div className="flex flex-col gap-2">
      <Toggle label="n" value={n} onChange={setN} />
      <Toggle label="m" value={m} onChange={setM} />
    </div>
  );
}
