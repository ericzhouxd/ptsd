/**
 * SceneCanvas — the standard <Canvas> wrapper used by every theorem scene.
 *
 * Now ships with OrbitControls so the user can DRAG to rotate the scene
 * and SCROLL to zoom. Rotation is bounded so the camera can't flip over the
 * pole or swing fully around (the scene is a "diorama you peer into," not
 * a flythrough).
 *
 * Defaults baked in:
 *   • Background: navy (palette.bg)
 *   • Camera: perspective, slight top-front angle so the 3D-ness is obvious
 *     before the user touches anything
 *   • Lighting: ambient + one directional
 *   • dpr: [1, 2] — render at up to 2× device pixel ratio for crisp lines
 *   • Postprocessing: bloom for the 3b1b "soft glow" feel
 *   • OrbitControls with damping + bounded rotation
 *
 * See LEARNING.md §"react-three-fiber".
 */
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { ReactNode } from "react";
import { palette } from "@/lib/theme";
import { Postprocessing } from "./Postprocessing";

export function SceneCanvas({
  children,
  cameraPosition = [6, 5, 12],
  fov = 45,
  postprocessing = true,
  orbit = true,
}: {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  postprocessing?: boolean;
  orbit?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: cameraPosition, fov, near: 0.1, far: 1000 }}
      style={{ background: palette.bg }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={0.4} />

      {children}

      {orbit && (
        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={6}
          maxDistance={40}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI - Math.PI / 8}
        />
      )}

      {postprocessing && <Postprocessing />}
    </Canvas>
  );
}
