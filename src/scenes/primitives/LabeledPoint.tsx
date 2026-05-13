/**
 * LabeledPoint — a small sphere at a 3D position with a floating HTML label.
 *
 * Useful for marking origins, named points (e.g., "M e₁"), or pivot points
 * during a proof animation.
 */
"use client";

import type { ReactNode } from "react";
import { palette } from "@/lib/theme";
import { Html2DOverlay } from "./Html2DOverlay";

type Vec3 = [number, number, number];

export function LabeledPoint({
  position,
  label,
  color = palette.fg,
  size = 0.08,
}: {
  position: Vec3;
  label?: ReactNode;
  color?: string;
  size?: number;
}) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {label && (
        <Html2DOverlay position={[0, 0, 0]} className="text-xs text-fg-muted whitespace-nowrap select-none">
          {label}
        </Html2DOverlay>
      )}
    </group>
  );
}
