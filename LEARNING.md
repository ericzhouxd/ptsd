# LEARNING.md — a tour of the PTSD codebase

This is your textbook for the project. Each section explains one library or concept, then points you at a concrete file where it shows up.

The recommended reading order is top to bottom: the early sections give you context the later ones build on.

If you already know a library, skim the section to learn what *we* do with it (which features we use, which we ignore, what the project's conventions are) and skip ahead.

---

## 1. What you're building

A web app where each entry is a math theorem with three things side by side:

1. The **statement** in formal LaTeX (the theorem as you'd see it in a textbook).
2. A **live, interactive geometric demonstration** — fills the background of the page; the user can edit parameters and watch the visualization respond.
3. The **proof** in LaTeX, available behind a side-nav switch.

The theorem-page UX is *immersive*: the demo fills the viewport as a fixed background, and the statement and proof appear as glass-card overlays that scroll over it. The first version ships one theorem — the **Rank-Nullity Theorem** from linear algebra — plus the reusable parts every future theorem will compose from.

The aesthetic is openly inspired by 3blue1brown: dark navy background, smoothly tweened transitions, restrained palette (yellow, blue, red, green), no shadows or gradients.

---

## 2. The big picture (the request → pixels pipeline)

```
Browser    HTML+JS arrive over HTTP from Vercel (or your dev server).
   │
   ▼
Next.js    Routes the URL (/theorems/rank-nullity) to a page file.
App Router Pre-renders the page's HTML at BUILD time — the LaTeX, prose, layout — so the user sees content immediately.
   │
   ▼
React      Renders the static page tree, then HYDRATES (attaches event handlers, wakes up state).
   │
   ▼
MDX        Theorem statements & proofs are .mdx files. At build time they were compiled into React components.
KaTeX      Inside MDX, `$x^2$` was turned into rendered HTML at build time too. No client-side LaTeX cost.
   │
   ▼
r3f        On the theorem page, the <Scene/> mounts in the browser. r3f is a React renderer that turns
           JSX (<mesh/>, <group/>) into a Three.js scene graph.
   │
   ▼
Three.js   Manages the scene graph, geometry, materials, the camera, and the render loop.
   │
   ▼
WebGL      Three.js translates the scene into WebGL draw calls. The browser hands these to the GPU.
   │
   ▼
GPU        Pixels.
```

When the user types a number into the matrix input, the path is:

```
<input> change → zustand store update → React re-renders the components that subscribed to that slice
              → spring re-targets new values → useFrame ticks every frame, reads spring values, mutates Three.js geometry
              → WebGL redraws → user sees the grid morphing.
```

---

## 3. Next.js App Router

Next.js is a React framework. We use the **App Router** (the modern one introduced in Next 13), which means routing is **file-based**: a folder under `src/app/` is a URL.

```
src/app/page.tsx                       → /
src/app/theorems/rank-nullity/page.tsx → /theorems/rank-nullity
```

Two flavors of components matter here:

- **Server components** (default — no `'use client'` directive at the top of the file): rendered to HTML on the server (or at build time, since our pages are static), never sent to the browser as JavaScript. Use these for static prose, layouts, anything that doesn't need browser APIs or React state.
- **Client components** (`'use client'` at the top): hydrated in the browser, can use `useState`, refs, `window`, event handlers. Required for anything interactive.

The interactive scene is a client component. The MDX prose around it is server-rendered. Both live on the same page.

A small wrinkle: Three.js can't render on the server (no WebGL, no DOM). To prevent it from being bundled into server-rendered output, we use `dynamic(() => import('...'), { ssr: false })`. That call MUST happen inside a client component, which is why there's a `Scene.tsx` wrapper that does nothing but the dynamic import.

→ see `src/app/theorems/rank-nullity/page.tsx` and `src/app/theorems/rank-nullity/Scene.tsx`

---

## 4. MDX in this project

MDX is Markdown that can import React components and use them inline. So a `.mdx` file like:

```mdx
import Scene from './Scene'

# A Theorem

Some prose with $x^2 + y^2 = r^2$ inline.

<Scene />
```

…compiles into a React component you can `import` from a `.tsx` file:

```tsx
import Statement from './statement.mdx'
// <Statement /> now renders the content above
```

The pipeline is wired in `next.config.ts`:

- **`@next/mdx`** is the loader that turns `.mdx` files into React components at build time.
- **`remark-math`** is a remark (Markdown AST) plugin that recognizes `$...$` and `$$...$$` and turns them into special math nodes.
- **`rehype-katex`** is a rehype (HTML AST) plugin that takes those math nodes and turns them into KaTeX-rendered HTML.

The result: by the time the browser loads the page, the math is already rendered as static HTML. The browser doesn't need to know any LaTeX.

One Next 16 + Turbopack quirk: plugins must be passed as **string specifiers** (`["remark-math", {}]`) rather than imported function references, so the loader options are serializable across worker boundaries.

→ see `next.config.ts` and `src/app/theorems/rank-nullity/statement.mdx`

---

## 5. KaTeX

LaTeX is a typesetting language. KaTeX is a JavaScript implementation of it focused on speed and synchronous rendering (vs. MathJax, which is more complete but slower and async).

We use KaTeX in two ways:

1. **Build-time, via rehype-katex** (the main path): the math in `.mdx` files becomes static HTML before it ever reaches the browser. This is most of the math you see on the site.
2. **Runtime, via `<Tex>`** (the secondary path): for math that lives outside MDX — for example, a label on a vector arrow inside the 3D scene. The `<Tex>` component calls `katex.renderToString()` and dangerously sets the resulting HTML.

KaTeX's CSS file must be loaded once, globally — that's the `import "katex/dist/katex.min.css"` line at the top of `src/app/layout.tsx`. Forgetting this is a classic mistake; the math renders but looks like raw HTML (no proper math fonts or layout).

→ see `src/components/math/Tex.tsx` and `src/app/layout.tsx`

---

## 6. react-three-fiber (r3f)

r3f is a **React renderer for Three.js**. Normally Three.js is imperative — you create a `Scene`, add a `Mesh`, call `renderer.render(scene, camera)` in a loop. r3f lets you write the same scene declaratively in JSX:

```tsx
<Canvas>
  <ambientLight intensity={0.5} />
  <mesh position={[1, 0, 0]}>
    <sphereGeometry args={[0.5, 16, 16]} />
    <meshBasicMaterial color="orange" />
  </mesh>
</Canvas>
```

Every JSX tag inside `<Canvas>` corresponds to a Three.js class. `<mesh>` is `THREE.Mesh`, `<sphereGeometry>` is `THREE.SphereGeometry`, etc. r3f reconciles this tree into a real Three.js scene and re-renders 60 times a second.

Three things to know:

- **`useFrame(callback)`**: a hook that calls `callback` on every animation frame. This is where you put per-frame logic (animation, manual updates).
- **Refs**: when you need direct access to a Three.js object (to mutate its position imperatively each frame, for performance), use `useRef`. r3f attaches the actual Three.js instance to `ref.current`.
- **Drei** (`@react-three/drei`): a companion library of useful helpers — `<Line>` for thick lines, `<Html>` for HTML-overlaid-on-3D, `<OrbitControls>` for camera dragging. We use a few.

→ see `src/scenes/primitives/SceneCanvas.tsx` (the `<Canvas>` wrapper) and `src/scenes/rank-nullity/RankNullityScene.tsx` (composition)

---

## 7. Three.js objects we use

Three.js has hundreds of classes. We touch only a handful:

- **`Mesh`**: a renderable 3D object = geometry + material. The cone arrowheads, the parallelogram patches.
- **`BufferGeometry`**: a generic geometry defined by raw vertex data. We use this for the parallelogram patch in `SubspaceHighlight`.
- **`coneGeometry`, `sphereGeometry`**: prebuilt shapes.
- **`meshBasicMaterial`**: a flat-shaded material that ignores lighting (always shows its base color). We use this for vector arrowheads and subspace highlights — we want them to glow, not respond to lights.
- **`Line2` / `LineMaterial`**: thick lines with consistent pixel width. Default Three.js lines render as 1px regardless of platform; `Line2` works around this. We never touch it directly — drei's `<Line>` component wraps it.
- **`Vector3`, `Quaternion`**: math primitives. Reused per-frame to avoid garbage collection pressure.
- **EffectComposer + Bloom** (`@react-three/postprocessing`): post-processing pipeline. Bloom makes bright pixels glow into their neighbors — that's the soft 3blue1brown sheen.

→ see `src/scenes/primitives/TransformedGrid.tsx` (uses BufferGeometry mutation in useFrame)

---

## 8. `@react-spring/three`

A spring-based animation library. You give it target values; it tweens the current values toward them with realistic physics (tension + friction). When the target changes, it re-tweens from wherever it currently is.

Usage in this project:

```tsx
const [spring, api] = useSpring(() => ({ x: 1, y: 0, z: 0, config: motion.defaultSpring }));

useEffect(() => {
  api.start({ x: 2, y: 1, z: 0 });  // re-target → smoothly transitions
}, [...]);

useFrame(() => {
  const x = spring.x.get();  // read current animated value
  // ... mutate Three.js objects with it
});
```

We pair springs with **imperative refs** rather than `<animated.mesh>` for two reasons:

1. The Three.js geometry attribute updates we need (e.g., `geometry.setPositions([...])` for thick lines) aren't exposed as animated React props.
2. Skipping React re-renders during animation (60×/sec) is a meaningful performance win.

The spring config (`tension: 120, friction: 26`) lives in `src/lib/theme.ts` so all primitives feel consistent. Tension is stiffness (higher = snappier); friction is damping (higher = less bounce).

→ see `src/scenes/primitives/VectorArrow.tsx` (single value spring) and `TransformedGrid.tsx` (matrix entries spring)

---

## 9. zustand

A tiny state management library. Think `useState`, but the state lives outside any component, so multiple components can subscribe to it — they don't need a common parent.

Why we need this: the theorem page mounts the scene as a fixed background and the floating control panel as a sibling. Neither is a parent of the other, so prop-drilling won't work. Lifting state to a common ancestor would mean wrapping everything in a context provider just for that one piece of state.

Usage:

```tsx
const useSceneStore = create<State>((set) => ({
  matrix: [[1, 0], [0, 1]],
  setEntry: (r, c, v) => set((s) => ({ /* ... */ })),
}));

// In any component:
const matrix = useSceneStore((s) => s.matrix);  // selector — re-renders only when matrix changes
const setEntry = useSceneStore((s) => s.setEntry);
```

Two stores in this project:
- **`sceneStore`** — the Rank-Nullity scene's math state (`n`, `m`, `matrix`).
- **`uiStore`** — page UI signals shared between siblings (currently just `dim` for the scene-darkening effect).

→ see `src/scenes/rank-nullity/sceneStore.ts` and `src/components/theorem/uiStore.ts`

---

## 10. Tailwind CSS

A utility-first CSS framework: instead of writing `.button { padding: 8px 16px; ... }`, you write `<button className="px-4 py-2 ...">`. Each utility class corresponds to one CSS property.

We're on Tailwind **v4**, which switched the configuration model. There is **no `tailwind.config.ts`**; instead, theme tokens live in CSS via the `@theme` directive at the top of `src/app/globals.css`:

```css
@theme {
  --color-yellow: #ffd866;
  --color-bg: #0e1116;
  --font-sans: "KaTeX_Main", serif;
}
```

Each `--color-*` token automatically becomes Tailwind classes: `bg-yellow`, `text-yellow`, `border-yellow`, etc.

The same palette also exists as JavaScript constants in `src/lib/theme.ts`. That's because Three.js can't read CSS — it needs literal hex strings at JS eval time. The two files mirror each other; if you change a color, change both.

→ see `src/app/globals.css` and `src/lib/theme.ts`

---

## 11. The theorem-page layout

The visual idea: the demo is the hero — it fills the viewport as the background. Prose (statement, proof) appears as full-viewport "walls" that fade in over the scene. Switching between **statement / scene / proof** happens exclusively via a small side-nav (`SectionNav`); nothing scrolls. This avoids a UX trap where wheel-zoom on the canvas conflicts with wheel-scroll on the page.

How the layers stack, back to front:

```
[fixed]  TheoremBackground (canvas)    z-0   → the live <Scene/>
[fixed]  TheoremBackground (dim)       z-1   → dark overlay, opacity 0 in scene mode, 0.92 otherwise
[fixed]  StatementOverlay              z-10  → glass-wall, opacity 1 only when mode === "statement"
[fixed]  ProofOverlay                  z-10  → glass-wall, opacity 1 only when mode === "proof"
[fixed]  FloatingControls              z-20  → matrix controls, visible only when mode === "scene"
[fixed]  SectionNav                    z-30  → three-row switcher, always visible
```

State lives in `uiStore`: a single `mode: "statement" | "scene" | "proof"` value. `SectionNav` writes it; everything else reads it and toggles its own opacity + pointer-events. Transitions are pure CSS (`transition-opacity duration-500`).

Pointer-event flow: the canvas wrapper does NOT have `pointer-events-none` so OrbitControls can drag/zoom. Walls and controls toggle their own `pointer-events` between `auto` (visible) and `none` (hidden), so when you're in scene mode the canvas is fully interactive, and when a wall is up it captures everything cleanly.

→ see `src/components/theorem/` (TheoremBackground, StatementOverlay, ProofOverlay, FloatingControls, SectionNav, uiStore) and `src/app/theorems/rank-nullity/page.tsx`

---

## 12. TypeScript glossary

The TS features used in this codebase, each in two lines:

- **`type`**: a name for a shape. `type Vec3 = [number, number, number]` — now `Vec3` is a tuple of three numbers.
- **`interface`**: similar to `type`, but extensible. We rarely use it.
- **Generic `<T>`**: lets a function or type accept a "fill in the blank". `useState<number>(0)` says the state is a number.
- **`as const`**: pins a value to its narrowest possible type. `[2, 3] as const` is `readonly [2, 3]`, not `number[]`.
- **Union `A | B`**: a value of either type. `Dim = 2 | 3` — only 2 or 3, nothing else.
- **`Readonly<T>`**: `T` but immutable. `Readonly<{ children: ReactNode }>` — props can't be reassigned.
- **`type X = { foo: string }`** vs. **`interface X { foo: string }`**: nearly equivalent; pick `type` unless you need declaration merging.
- **Optional `?`**: `lineWidth?: number` — the prop may be omitted. Inside the function it's typed as `number | undefined`.
- **`!` (non-null assertion)**: tells TS "this is definitely not null/undefined." Avoid; prefer narrowing.
- **`satisfies`**: says "this value matches type X" without widening its type. We don't use it currently but it's useful for big config objects.

---

If you read these in order and skim the linked file as you go, you'll understand 90% of the codebase. The remaining 10% is the actual scene composition (`RankNullityScene.tsx`) and the linear-algebra math (`linalg.ts`) — both are well-commented and short.
