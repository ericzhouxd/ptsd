/**
 * FloatingControls — glass panel pinned to the bottom-right of the viewport.
 *
 * Visible only in `mode === "scene"` — when either wall is up, the user is
 * reading, and matrix controls would just be visual noise.
 *
 * Concepts demonstrated:
 *   • position: fixed for viewport-relative placement
 *   • z-index layering: above the canvas (z-20) so its controls always win clicks
 *   • zustand selector subscription: re-renders only when `mode` changes
 */
"use client";

import { useState, type ReactNode } from "react";
import { useUiStore } from "./uiStore";

export function FloatingControls({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const mode = useUiStore((s) => s.mode);
  const visible = mode === "scene";

  return (
    <div
      className="fixed bottom-6 right-6 z-20 transition-opacity duration-500"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      aria-hidden={!visible}
    >
      {open ? (
        <div className="glass p-5 min-w-[260px] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-fg-muted text-[10px] uppercase tracking-widest">
              Controls
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Collapse controls"
              className="text-fg-muted hover:text-fg text-sm leading-none w-5 h-5 flex items-center justify-center transition-colors"
            >
              −
            </button>
          </div>
          {children}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open controls"
          className="glass px-4 py-2 text-xs font-medium text-fg-muted hover:text-fg transition-colors"
        >
          Controls
        </button>
      )}
    </div>
  );
}
