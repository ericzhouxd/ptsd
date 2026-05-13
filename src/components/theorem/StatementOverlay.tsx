/**
 * StatementOverlay — full-viewport "wall" with the theorem statement.
 *
 * Visible only while the page is in `mode === "statement"`. Otherwise fades
 * to opacity 0 + `pointer-events: none` so it doesn't intercept events
 * meant for the canvas underneath.
 *
 * Structure: the backdrop and the content are SIBLINGS, both `absolute
 * inset-0`. This guarantees the backdrop fills the viewport regardless of
 * how short the statement is — if backdrop and content lived in the same
 * div, the div's height would be content-driven and the backdrop would
 * shrink with the prose.
 */
"use client";

import type { ReactNode } from "react";
import { useUiStore } from "./uiStore";

export function StatementOverlay({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const mode = useUiStore((s) => s.mode);
  const visible = mode === "statement";

  return (
    <div
      className="fixed inset-0 z-10 transition-opacity duration-500"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      aria-hidden={!visible}
    >
      {/* Backdrop — always exactly the viewport, never the size of the prose. */}
      <div className="glass-wall absolute inset-0" />
      {/* Content layer — separate, also full-viewport, centers the prose. */}
      <div className="absolute inset-0 flex items-center justify-center px-8 py-20">
        <div className="relative z-[1] max-w-[720px] w-full prose-theorem">
          <h1 className="font-latex text-5xl font-semibold tracking-tight mb-8">
            {title}
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
}
