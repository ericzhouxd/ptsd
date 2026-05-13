/**
 * ProofOverlay — full-viewport "wall" with the formal proof.
 *
 * Visible only while the page is in `mode === "proof"`. Otherwise fades out
 * and stops capturing pointer events. The inner content scrolls within the
 * wall (overflow-y-auto) for proofs longer than a viewport.
 *
 * Backdrop and content layer are siblings (both `absolute inset-0`) so the
 * backdrop is always exactly viewport-sized — see StatementOverlay for why
 * this matters.
 */
"use client";

import type { ReactNode } from "react";
import { useUiStore } from "./uiStore";

export function ProofOverlay({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const mode = useUiStore((s) => s.mode);
  const visible = mode === "proof";

  return (
    <div
      className="fixed inset-0 z-10 transition-opacity duration-500"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      aria-hidden={!visible}
    >
      <div className="glass-wall absolute inset-0" />
      <div className="absolute inset-0 flex items-center justify-center px-8 py-16">
        <div className="relative z-[1] max-w-[720px] w-full prose-theorem max-h-full overflow-y-auto pr-2">
          <h2 className="font-latex text-4xl font-semibold tracking-tight mb-6">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
}
