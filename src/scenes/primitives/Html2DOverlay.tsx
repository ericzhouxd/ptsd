/**
 * Html2DOverlay — render arbitrary HTML at a 3D world position.
 *
 * Wraps drei's <Html> with project defaults: the label tracks its world
 * position by projecting onto the screen each frame, doesn't intercept pointer
 * events (so the user can still drag/click through it), and stays crisp
 * regardless of zoom (transform={false} disables the auto-scaling that would
 * shrink it as the camera pulls back).
 *
 * Use this for vector labels ("M e₁"), domain/codomain titles, etc.
 */
"use client";

import type { ReactNode } from "react";
import { Html } from "@react-three/drei";

type Vec3 = [number, number, number];

export function Html2DOverlay({
  position,
  children,
  className = "",
  offset = [12, -8],
}: {
  position: Vec3;
  children: ReactNode;
  className?: string;
  /** Pixel offset from the projected world position (x, y). */
  offset?: [number, number];
}) {
  return (
    <Html
      position={position}
      transform={false}
      style={{ pointerEvents: "none", transform: `translate(${offset[0]}px, ${offset[1]}px)` }}
      className={className}
    >
      {children}
    </Html>
  );
}
