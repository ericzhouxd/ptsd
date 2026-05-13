/**
 * Theorem registry — single source of truth for what theorems the site offers.
 *
 * The homepage reads this list and renders one TheoremCard per `status: 'ready'`
 * entry. Adding a new theorem is a two-line change here, plus creating the
 * matching folder under `src/app/theorems/<slug>/`.
 *
 * Why a manual registry vs. a filesystem scan:
 *   • Types stay tight — TheoremEntry catches typos at build time
 *   • Order is explicit (you control how theorems appear in the list)
 *   • No build-time fs glob magic
 *
 * See LEARNING.md §"Next.js App Router" for how the slug maps to URLs.
 */

export type TheoremEntry = {
  slug: string;
  title: string;
  /** One-line plain-text summary shown on the card. No LaTeX (it's a tooltip-style tease). */
  blurb: string;
  status: "ready" | "wip";
};

export const theorems: TheoremEntry[] = [
  {
    slug: "rank-nullity",
    title: "Rank-Nullity Theorem",
    blurb: "For T: ℝⁿ → ℝᵐ,  dim ker T + dim im T = n.",
    status: "ready",
  },
];
