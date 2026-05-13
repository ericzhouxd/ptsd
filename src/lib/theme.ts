/**
 * Theme constants — single source of truth for the 3b1b-style palette,
 * line widths, and animation timings used by Three.js scenes.
 *
 * The DOM/CSS side of these values lives in `src/app/globals.css` under
 * `@theme { ... }`. Keep the two in sync when changing colors.
 *
 * Why duplicate? Three.js doesn't read CSS variables — it needs literal
 * hex strings at JS eval time. So r3f primitives import from here; Tailwind
 * classes use the CSS-side values. Same numbers, two encodings.
 *
 * See LEARNING.md §"`@react-spring/three`" for what the spring config means.
 */

export const palette = {
  bg: "#0e1116",
  fg: "#e6e8eb",
  fgMuted: "#9aa3b2",

  yellow: "#ffd866",
  blue: "#5b92e5",
  red: "#e55b6a",
  green: "#7cdb8a",

  grid: "#3a4252",
  gridDim: "#222831",

  // Semantic aliases (used by Rank-Nullity scene)
  nullSpace: "#ffd866",
  columnSpace: "#5b92e5",
  axisX: "#e55b6a",
  axisY: "#7cdb8a",
  axisZ: "#5b92e5",
} as const;

export const lineWidths = {
  thin: 1.5,
  normal: 2.5,
  thick: 4,
} as const;

/**
 * Spring physics for tweened scene animations.
 * tension = stiffness (higher → snappier).
 * friction = damping (higher → less bounce).
 * These values land near 900ms ease-in-out-cubic in feel.
 */
export const motion = {
  defaultSpring: { tension: 120, friction: 26, precision: 1e-4 },
  duration: { fast: 400, normal: 900, slow: 1400 },
} as const;
