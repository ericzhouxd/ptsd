/**
 * Scene — client wrapper around RankNullityScene that disables SSR.
 *
 * Three.js cannot render on the server (no WebGL context, no DOM). Next 15+
 * App Router won't let us use `dynamic(..., { ssr: false })` directly inside a
 * server component, so we put it inside this client wrapper.
 *
 * Result: the heavy r3f bundle (~500KB gzipped: three.js + r3f + drei +
 * postprocessing) only loads on this page, lazily, after the page mounts in
 * the browser. The homepage stays Three-free.
 *
 * See LEARNING.md §"Next.js App Router".
 */
"use client";

import dynamic from "next/dynamic";

const RankNullityScene = dynamic(
  () =>
    import("@/scenes/rank-nullity/RankNullityScene").then(
      (m) => m.RankNullityScene
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-full grid place-items-center text-fg-muted text-sm">
        Loading scene…
      </div>
    ),
  }
);

export default function Scene() {
  return <RankNullityScene />;
}
