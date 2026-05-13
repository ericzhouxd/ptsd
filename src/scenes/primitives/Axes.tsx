/**
 * Axes — colored x/y(/z) axes with arrowheads.
 *
 * Convention: x = red, y = green, z = blue (matches Three.js default and most
 * math textbooks). The colors come from `palette.axisX/Y/Z` in lib/theme.ts.
 *
 * `dim` controls how many axes to draw — 2 gives x/y only (for R²-style scenes),
 * 3 adds z (for R³).
 *
 * Arrowheads are simple Three.js cones positioned at the axis tips.
 */
"use client";

import { Line } from "@react-three/drei";
import { palette, lineWidths } from "@/lib/theme";

export function Axes({
  length = 4,
  dim = 2,
  lineWidth = lineWidths.normal,
  headSize = 0.18,
}: {
  length?: number;
  dim?: 2 | 3;
  lineWidth?: number;
  headSize?: number;
}) {
  const axes: Array<{
    end: [number, number, number];
    color: string;
    rotation: [number, number, number];
  }> = [
    {
      end: [length, 0, 0],
      color: palette.axisX,
      rotation: [0, 0, -Math.PI / 2],
    },
    {
      end: [0, length, 0],
      color: palette.axisY,
      rotation: [0, 0, 0],
    },
  ];

  if (dim === 3) {
    axes.push({
      end: [0, 0, length],
      color: palette.axisZ,
      rotation: [Math.PI / 2, 0, 0],
    });
  }

  return (
    <group>
      {axes.map((axis, i) => (
        <group key={i}>
          <Line
            points={[[0, 0, 0], axis.end]}
            color={axis.color}
            lineWidth={lineWidth}
          />
          <mesh position={axis.end} rotation={axis.rotation}>
            <coneGeometry args={[headSize * 0.6, headSize * 1.4, 16]} />
            <meshBasicMaterial color={axis.color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
