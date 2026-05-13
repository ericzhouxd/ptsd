/**
 * VectorArrow — a thick line from `from` to `to` with a cone arrowhead.
 *
 * The PRIMARY animation primitive: when `to` changes, the arrow tip springs
 * to its new position over ~900ms (easeInOutCubic-feeling). Used everywhere
 * we need to show a vector that responds to user input — e.g., the column
 * vectors of M change as the user types into MatrixInput, and the arrows
 * morph in real time.
 *
 * Implementation note (the imperative bit):
 *   r3f gives us a declarative React tree, but per-frame animation is most
 *   efficient when done IMPERATIVELY via refs — avoids re-rendering React
 *   60 times per second. Pattern:
 *     1. useSpring holds the current spring values
 *     2. useFrame runs every render tick, reads spring values via .get()
 *     3. Mutates Three.js geometry / position / rotation directly via refs
 *
 * See LEARNING.md §"`@react-spring/three`" and §"react-three-fiber".
 */
"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useSpring } from "@react-spring/three";
import { Mesh, Vector3, Quaternion } from "three";
import { palette, lineWidths, motion } from "@/lib/theme";

const Y_UP = new Vector3(0, 1, 0);
// Reused per-frame to avoid GC pressure
const _dir = new Vector3();
const _quat = new Quaternion();

type Vec3 = [number, number, number];

export function VectorArrow({
  from = [0, 0, 0],
  to,
  color = palette.yellow,
  lineWidth = lineWidths.normal,
  headSize = 0.18,
}: {
  from?: Vec3;
  to: Vec3;
  color?: string;
  lineWidth?: number;
  headSize?: number;
}) {
  // The drei <Line> ref points at a Line2 instance whose geometry exposes
  // setPositions(number[]). We use that to update the line endpoints per frame.
  // Typed loosely because drei doesn't re-export the Line2 type cleanly.
  const lineRef = useRef<{ geometry: { setPositions: (a: number[]) => void } }>(null);
  const coneRef = useRef<Mesh>(null);

  const [spring, api] = useSpring(() => ({
    x: to[0],
    y: to[1],
    z: to[2],
    config: motion.defaultSpring,
  }));

  // Re-target the spring whenever `to` changes. The spring will smoothly
  // animate from its current value to the new target.
  useEffect(() => {
    api.start({ x: to[0], y: to[1], z: to[2] });
  }, [to, api]);

  useFrame(() => {
    const tx = spring.x.get();
    const ty = spring.y.get();
    const tz = spring.z.get();

    if (lineRef.current) {
      lineRef.current.geometry.setPositions([
        from[0], from[1], from[2],
        tx, ty, tz,
      ]);
    }

    if (coneRef.current) {
      coneRef.current.position.set(tx, ty, tz);
      _dir.set(tx - from[0], ty - from[1], tz - from[2]);
      if (_dir.lengthSq() > 1e-8) {
        _dir.normalize();
        _quat.setFromUnitVectors(Y_UP, _dir);
        coneRef.current.quaternion.copy(_quat);
      }
    }
  });

  return (
    <group>
      <Line
        ref={lineRef as never}
        points={[from, to]}
        color={color}
        lineWidth={lineWidth}
      />
      <mesh ref={coneRef} position={to}>
        <coneGeometry args={[headSize * 0.5, headSize * 1.4, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}
