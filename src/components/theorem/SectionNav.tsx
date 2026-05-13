/**
 * SectionNav — the sole way to switch between statement / scene / proof.
 *
 * Three small rows on the right edge: each is a label + dot. Clicking a row
 * sets the page mode in uiStore; the active row gets a yellow glowing dot
 * and brighter text.
 *
 * Sits at z-30 (above .glass-wall and FloatingControls) so it stays usable
 * regardless of which mode is active. That's the whole point — the user
 * needs to be able to switch from any state.
 */
"use client";

import { useUiStore, type Mode } from "./uiStore";

export type SectionTarget = {
  id: Mode;
  label: string;
};

export function SectionNav({ targets }: { targets: SectionTarget[] }) {
  const mode = useUiStore((s) => s.mode);
  const setMode = useUiStore((s) => s.setMode);

  return (
    <nav
      aria-label="Theorem sections"
      className="fixed top-1/2 right-6 -translate-y-1/2 z-30 flex flex-col gap-3 pointer-events-auto"
    >
      {targets.map((t) => {
        const active = t.id === mode;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setMode(t.id)}
            aria-current={active ? "true" : undefined}
            className="group flex items-center gap-3 text-[10px] uppercase tracking-widest"
          >
            <span
              className={
                active
                  ? "text-fg"
                  : "text-fg-muted/70 group-hover:text-fg transition-colors"
              }
            >
              {t.label}
            </span>
            <span
              aria-hidden
              className={
                active
                  ? "inline-block w-1.5 h-1.5 rounded-full bg-yellow shadow-[0_0_8px_var(--color-yellow)]"
                  : "inline-block w-1.5 h-1.5 rounded-full bg-fg-muted/40 group-hover:bg-fg-muted transition-colors"
              }
            />
          </button>
        );
      })}
    </nav>
  );
}
