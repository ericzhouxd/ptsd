/**
 * TransformedGrid — the signature 3b1b "grid morph under linear transformation".
 *
 * One drei <Segments> mesh holds ALL grid lines in a single batched geometry.
 * Per-segment refs let us mutate `start` and `end` Vector3s in useFrame without
 * triggering React re-renders. drei rebuilds the underlying buffer once per
 * frame from those mutated values — far cheaper than N separate <Line> meshes.
 *
 * Animation: the matrix entries themselves spring (9 values via @react-spring).
 * Each frame, useFrame samples the live spring values, applies the matrix to
 * the static source segments, and pokes the resulting endpoints into segment refs.
 *
 * See LEARNING.md §"`@react-spring/three`".
 */
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Segments, Segment } from "@react-three/drei";
import { useSpring } from "@react-spring/three";
import { palette, lineWidths, motion } from "@/lib/theme";
import type { Vector3, Color } from "three";

type Vec3 = [number, number, number];
type SegmentRef = { start: Vector3; end: Vector3; color: Color } | null;

function makeSourceSegments(size: number, divisions: number): Array<[Vec3, Vec3]> {
  const out: Array<[Vec3, Vec3]> = [];
  const step = (2 * size) / divisions;
  for (let i = 0; i <= divisions; i++) {
    const t = -size + i * step;
    out.push([[t, -size, 0], [t, size, 0]]);
    out.push([[-size, t, 0], [size, t, 0]]);
  }
  return out;
}

/** Pad m×n matrix to 3×3 row-major. */
function padMatrix(matrix: number[][], n: number, m: number): number[] {
  const padded = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      padded[r * 3 + c] = matrix[r][c];
    }
  }
  return padded;
}

export function TransformedGrid({
  matrix,
  n,
  m,
  size = 4,
  divisions = 8,
  color = palette.blue,
  lineWidth = lineWidths.normal,
}: {
  matrix: number[][];
  n: 2 | 3;
  m: 2 | 3;
  size?: number;
  divisions?: number;
  color?: string;
  lineWidth?: number;
}) {
  const sourceSegments = useMemo(
    () => makeSourceSegments(size, divisions),
    [size, divisions]
  );

  const refs = useRef<SegmentRef[]>([]);

  const padded = useMemo(() => padMatrix(matrix, n, m), [matrix, n, m]);

  const [spring, api] = useSpring(() => ({
    m0: padded[0], m1: padded[1], m2: padded[2],
    m3: padded[3], m4: padded[4], m5: padded[5],
    m6: padded[6], m7: padded[7], m8: padded[8],
    config: motion.defaultSpring,
  }));

  useEffect(() => {
    api.start({
      m0: padded[0], m1: padded[1], m2: padded[2],
      m3: padded[3], m4: padded[4], m5: padded[5],
      m6: padded[6], m7: padded[7], m8: padded[8],
    });
  }, [padded, api]);

  useFrame(() => {
    const m0 = spring.m0.get(), m1 = spring.m1.get(), m2 = spring.m2.get();
    const m3 = spring.m3.get(), m4 = spring.m4.get(), m5 = spring.m5.get();
    const m6 = spring.m6.get(), m7 = spring.m7.get(), m8 = spring.m8.get();

    for (let i = 0; i < sourceSegments.length; i++) {
      const ref = refs.current[i];
      if (!ref) continue;
      const [p, q] = sourceSegments[i];
      ref.start.set(
        m0 * p[0] + m1 * p[1] + m2 * p[2],
        m3 * p[0] + m4 * p[1] + m5 * p[2],
        m6 * p[0] + m7 * p[1] + m8 * p[2]
      );
      ref.end.set(
        m0 * q[0] + m1 * q[1] + m2 * q[2],
        m3 * q[0] + m4 * q[1] + m5 * q[2],
        m6 * q[0] + m7 * q[1] + m8 * q[2]
      );
    }
  });

  return (
    <Segments limit={sourceSegments.length} lineWidth={lineWidth}>
      {sourceSegments.map((seg, i) => (
        <Segment
          key={i}
          ref={((el: SegmentRef) => {
            refs.current[i] = el;
          }) as never}
          start={seg[0]}
          end={seg[1]}
          color={color}
        />
      ))}
    </Segments>
  );
}
