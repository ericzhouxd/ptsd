# Proven Theorems Simply Demonstrated

A web app that pairs mathematical theorems with live, interactive geometric demonstrations in the spirit of 3Blue1Brown. Each entry has the formal statement and proof in LaTeX alongside a draggable, zoomable 3D scene.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

## What's here (v1)

- **Homepage** (`/`) — flat list of theorems
- **Rank-Nullity Theorem** (`/theorems/rank-nullity`) — the first entry. A live scene of `T: ℝⁿ → ℝᵐ` (for n, m ∈ {2, 3}) with the null space and column space morphing in real time as you edit the matrix M. Drag to rotate, scroll to zoom.

The page has three modes — **Statement / Scene / Proof** — switched via the side-nav on the right edge. Nothing scrolls; switching is instant and clean.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** (CSS-based config — no `tailwind.config.ts`)
- **MDX** (`@next/mdx`) for theorem statements and proofs
- **KaTeX** (via `remark-math` + `rehype-katex`) — math rendered at build time
- **react-three-fiber** + **Three.js** + **@react-three/drei** — the live scene
- **@react-spring/three** — physics-based tweens for matrix changes
- **zustand** — small stores for scene state and page mode
- **Inter** (UI chrome) and **Computer Modern / KaTeX_Main** (titles, prose, math)

## Learning the codebase

If you're new to any of these libraries, read [LEARNING.md](./LEARNING.md) first.

## Project layout

```
src/
├─ app/                       # Next.js App Router
│  ├─ layout.tsx              # root HTML shell, fonts, KaTeX CSS
│  ├─ page.tsx                # homepage
│  └─ theorems/<slug>/        # one folder per theorem
│     ├─ page.tsx             # composes the immersive layout
│     ├─ Scene.tsx            # client-only r3f wrapper
│     ├─ ControlPanel.tsx     # contents of the bottom-right panel
│     ├─ statement.mdx        # statement (LaTeX + prose)
│     └─ proof.mdx            # proof
├─ components/
│  ├─ chrome/                 # site header, theorem cards
│  ├─ math/                   # KaTeX wrappers
│  └─ theorem/                # immersive page chrome (TheoremBackground,
│                             #   StatementOverlay, ProofOverlay,
│                             #   FloatingControls, SectionNav, uiStore)
├─ scenes/
│  ├─ primitives/             # reusable r3f kit (SceneCanvas, Grid, Axes,
│  │                          #   VectorArrow, TransformedGrid, Subspace…)
│  └─ rank-nullity/           # the theorem-specific scene + state
├─ lib/                       # palette, linear algebra, animation defaults
└─ theorems/registry.ts       # source of truth for the homepage list
```

## Adding a new theorem

1. Create `src/app/theorems/<slug>/` with `page.tsx`, `Scene.tsx`, `ControlPanel.tsx`, `statement.mdx`, `proof.mdx`.
2. Build the scene by composing the primitives in `src/scenes/primitives/`. If you need theorem-specific math, add it to `src/lib/`.
3. Add the entry to `src/theorems/registry.ts` so it shows up on the homepage.

The Rank-Nullity files are the working example — copy that shape.

## Scripts

```bash
npm run dev      # dev server with hot reload
npm run build    # production build (typechecks + bundles)
npm run start    # serve the production build locally
npm run lint     # eslint
```

## License

MIT — see [LICENSE](./LICENSE).
