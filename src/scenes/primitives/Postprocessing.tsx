/**
 * Postprocessing — the visual-effect pipeline applied AFTER the scene renders.
 *
 * Single source of truth for the 3b1b "soft glow" look. By centralizing here,
 * every scene gets the same aesthetic without re-tuning bloom per scene.
 *
 * Effects in order:
 *   1. Bloom — bright pixels (high luminance) bleed light into neighbors.
 *      Gives vector tips and grid intersections that signature glow.
 *   2. HueSaturation — used to desaturate slightly when the proof section
 *      enters the viewport (we'll wire that in Phase 5 via a CSS variable
 *      / store value that this component subscribes to).
 *
 * Tuning: keep luminanceThreshold > 0 so dark grid lines DON'T glow (we only
 * want vectors and highlights to bloom).
 *
 * See LEARNING.md §"Three.js objects we use" for what postprocessing means.
 */
"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

export function Postprocessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.25}
        luminanceSmoothing={0.4}
        mipmapBlur
      />
    </EffectComposer>
  );
}
