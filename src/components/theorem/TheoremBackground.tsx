/**
 * TheoremBackground — fixed full-viewport wrapper for a scene canvas, with a
 * dim layer that comes up whenever a wall (statement or proof) is the active
 * mode.
 *
 * Stacking (lowest first):
 *   1. The Canvas itself (children) — z-0, fills the viewport
 *   2. Dim layer                     — z-1, semi-transparent over scene
 *   3. (consumers render their walls at higher z-index)
 *
 * Pointer events: the canvas wrapper does NOT have `pointer-events-none` —
 * OrbitControls needs mouse/wheel events to drag-rotate and zoom. The dim
 * layer is `pointer-events-none` so it never blocks. While a wall is active,
 * the wall sits above the canvas with `pointer-events-auto` and intercepts
 * everything; when in scene mode, the wall layers are opacity-0 +
 * pointer-events-none, so the canvas is fully interactive.
 */
"use client";

import type { ReactNode } from "react";
import { useUiStore } from "./uiStore";

export function TheoremBackground({ children }: { children: ReactNode }) {
  const mode = useUiStore((s) => s.mode);
  const sceneActive = mode === "scene";

  return (
    <>
      <div className="fixed inset-0 z-0">{children}</div>
      <div
        aria-hidden
        className="fixed inset-0 z-[1] pointer-events-none transition-opacity duration-500"
        style={{
          background: "var(--color-bg)",
          opacity: sceneActive ? 0 : 0.92,
        }}
      />
    </>
  );
}
