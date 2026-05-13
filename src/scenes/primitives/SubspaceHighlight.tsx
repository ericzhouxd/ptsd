/**
 * SubspaceHighlight — render a 0/1/2-dimensional subspace through the origin.
 *
 * Visual encoding by basis dimension:
 *   • 0 vectors → glowing point at origin (the trivial subspace {0})
 *   • 1 vector  → thick line through origin, extending ±extent along the basis
 *   • 2 vectors → translucent parallelogram patch spanning the basis
 *
 * Implementation note: the 2D parallelogram uses a STABLE BufferGeometry
 * created once and mutated via `position.needsUpdate = true` when basis
 * changes. The previous implementation re-created the geometry on every
 * change, leaking GPU memory and causing a microstutter on each keystroke.
 */
"use client";

import { useEffect, useMemo } from "react";
import { Line } from "@react-three/drei";
import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";
import { palette, lineWidths } from "@/lib/theme";

type Vec3 = [number, number, number];

export function SubspaceHighlight({
  basis,
  color = palette.yellow,
  extent = 4,
  opacity = 0.3,
}: {
  basis: Vec3[];
  color?: string;
  extent?: number;
  opacity?: number;
}) {
  const dim = basis.length;

  // ONE geometry per component instance; mutated in place when basis changes.
  const planeGeometry = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute(
      "position",
      new Float32BufferAttribute(new Float32Array(12), 3)
    );
    g.setIndex([0, 1, 2, 0, 2, 3]);
    return g;
  }, []);

  // Dispose the geometry when the component unmounts (prevents GPU leak).
  useEffect(() => {
    return () => planeGeometry.dispose();
  }, [planeGeometry]);

  // Update positions when basis or extent changes.
  useEffect(() => {
    if (dim !== 2) return;
    const e1 = new Vector3(...basis[0]).multiplyScalar(extent);
    const e2 = new Vector3(...basis[1]).multiplyScalar(extent);
    const v0 = new Vector3().subVectors(e1.clone().negate(), e2);
    const v1 = new Vector3().subVectors(e1, e2);
    const v2 = new Vector3().addVectors(e1, e2);
    const v3 = new Vector3().addVectors(e1.clone().negate(), e2);
    const positions = planeGeometry.attributes.position;
    positions.setXYZ(0, v0.x, v0.y, v0.z);
    positions.setXYZ(1, v1.x, v1.y, v1.z);
    positions.setXYZ(2, v2.x, v2.y, v2.z);
    positions.setXYZ(3, v3.x, v3.y, v3.z);
    positions.needsUpdate = true;
    planeGeometry.computeVertexNormals();
  }, [dim, basis, extent, planeGeometry]);

  if (dim === 0) {
    return (
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    );
  }

  if (dim === 1) {
    const v = basis[0];
    const a: Vec3 = [-v[0] * extent, -v[1] * extent, -v[2] * extent];
    const b: Vec3 = [v[0] * extent, v[1] * extent, v[2] * extent];
    return (
      <Line points={[a, b]} color={color} lineWidth={lineWidths.thick} />
    );
  }

  return (
    <mesh geometry={planeGeometry}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        side={2 /* THREE.DoubleSide */}
      />
    </mesh>
  );
}
