/**
 * Grid — a static unit grid in the XY plane (z=0).
 *
 * Now uses drei's <Segments> primitive so all grid lines render as ONE batched
 * mesh instead of N separate <Line> meshes. This drops draw call count from
 * ~22 to 1 and slashes React reconciliation overhead.
 *
 * Static — never animates. For the morphing grid, see TransformedGrid.
 */
"use client";

import { useMemo } from "react";
import { Segments, Segment } from "@react-three/drei";
import { palette, lineWidths } from "@/lib/theme";

type Vec3 = [number, number, number];

export function Grid({
  size = 5,
  divisions = 10,
  color = palette.gridDim,
  lineWidth = lineWidths.thin,
}: {
  size?: number;
  divisions?: number;
  color?: string;
  lineWidth?: number;
}) {
  const segments = useMemo<Array<[Vec3, Vec3]>>(() => {
    const out: Array<[Vec3, Vec3]> = [];
    const step = (2 * size) / divisions;
    for (let i = 0; i <= divisions; i++) {
      const t = -size + i * step;
      out.push([[t, -size, 0], [t, size, 0]]);
      out.push([[-size, t, 0], [size, t, 0]]);
    }
    return out;
  }, [size, divisions]);

  return (
    <Segments limit={segments.length} lineWidth={lineWidth}>
      {segments.map((seg, i) => (
        <Segment key={i} start={seg[0]} end={seg[1]} color={color} />
      ))}
    </Segments>
  );
}
