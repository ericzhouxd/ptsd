/**
 * TheoremCard — one row in the homepage list.
 *
 * Visual restraint: no shadows, no icons, no gradient accents. Just a thin
 * divider line, a title, and a blurb. Hover state nudges color toward the
 * 3b1b yellow — the only motion on the homepage.
 *
 * Concepts demonstrated:
 *   • next/link — client-side navigation between routes (no full page reload)
 *   • Tailwind transition utilities (200ms ease-out for hover)
 */
import Link from "next/link";
import type { TheoremEntry } from "@/theorems/registry";

export function TheoremCard({ entry }: { entry: TheoremEntry }) {
  return (
    <Link
      href={`/theorems/${entry.slug}`}
      className="group block border-t border-glass-border py-6 transition-colors duration-200 hover:bg-white/[0.02] focus:outline-none focus:bg-white/[0.03]"
    >
      <div className="flex items-baseline justify-between gap-6 px-6">
        <div>
          <h2 className="font-latex text-xl font-semibold tracking-tight text-fg transition-colors duration-200 group-hover:text-yellow">
            {entry.title}
          </h2>
          <p className="text-fg-muted mt-1 text-sm leading-relaxed">
            {entry.blurb}
          </p>
        </div>
        <span
          aria-hidden
          className="text-fg-muted text-2xl leading-none transition-transform duration-200 group-hover:translate-x-1 group-hover:text-yellow"
        >
          →
        </span>
      </div>
    </Link>
  );
}
