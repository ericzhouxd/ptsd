/**
 * SiteHeader — the title bar that appears on the homepage and (in compact form)
 * on theorem pages.
 *
 * The title is the joke: "Proven Theorems Simply Demonstrated" → PTSD. Kept
 * understated; no bold pun reveal anywhere in the UI.
 *
 * Concepts demonstrated:
 *   • Server component (no 'use client') — this is plain React rendered at build
 *     time. Faster first paint, no JS bundle cost for the homepage chrome.
 *   • Tailwind utilities driven by tokens from globals.css (text-fg, text-fg-muted)
 */
import Link from "next/link";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header
      className={
        compact
          ? "flex items-baseline gap-3 px-6 py-4"
          : "px-12 pt-12 pb-16"
      }
    >
      <Link
        href="/"
        className="group inline-block focus:outline-none"
        aria-label="Home"
      >
        <h1
          className={
            compact
              ? "font-latex text-base font-semibold tracking-tight text-fg"
              : "font-latex text-3xl font-semibold tracking-tight text-fg"
          }
        >
          Proven Theorems Simply Demonstrated
        </h1>
      </Link>
      {!compact && (
        <p className="text-fg-muted mt-2 max-w-xl text-sm leading-relaxed">
          A small library of theorems, each paired with an interactive
          geometric demonstration in the spirit of 3blue1brown.
        </p>
      )}
    </header>
  );
}
