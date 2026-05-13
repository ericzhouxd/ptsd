/**
 * Homepage — the flat (non-immersive) entry point.
 *
 * Deliberately Three.js-free: no Canvas, no animations, no heavy bundles.
 * That makes the first page load fast and saves the immersive treatment for
 * theorem pages where it carries weight.
 *
 * Reads `theorems` from the registry, filters to `status: 'ready'`, and
 * renders one TheoremCard per entry.
 */
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { TheoremCard } from "@/components/chrome/TheoremCard";
import { theorems } from "@/theorems/registry";

export default function Home() {
  const ready = theorems.filter((t) => t.status === "ready");

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl">
        <h2 className="px-6 pb-4 text-xs font-medium uppercase tracking-widest text-fg-muted">
          Theorems
        </h2>
        <ul className="border-b border-glass-border">
          {ready.map((entry) => (
            <li key={entry.slug}>
              <TheoremCard entry={entry} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
