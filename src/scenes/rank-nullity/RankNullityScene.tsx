/**
 * RankNullityScene — single ambient 3D space showing T: ℝⁿ → ℝᵐ.
 *
 * Replaces the old side-by-side layout. Now ONE coordinate system that the user
 * can drag to rotate (via OrbitControls in SceneCanvas):
 *
 *   • Static reference grid (faint, untransformed XY plane)
 *   • Faded standard basis e₁, …, eₙ (the inputs)
 *   • Bright transformed grid showing where the reference grid lands under M
 *   • Bright column vectors M e_i (the outputs)
 *   • Yellow null space subspace ker T
 *   • Blue column space subspace im T
 *
 * For 2D-into-2D, everything lives in the XY plane — drag to rotate and you
 * see the plane edge-on or from above. For 3D cases, vectors and grids lift
 * off the plane naturally.
 *
 * See LEARNING.md §"react-three-fiber" and §"zustand".
 */
"use client";

import { useMemo } from "react";
import { SceneCanvas } from "@/scenes/primitives/SceneCanvas";
import { Axes } from "@/scenes/primitives/Axes";
import { Grid } from "@/scenes/primitives/Grid";
import { VectorArrow } from "@/scenes/primitives/VectorArrow";
import { TransformedGrid } from "@/scenes/primitives/TransformedGrid";
import { SubspaceHighlight } from "@/scenes/primitives/SubspaceHighlight";
import { palette, lineWidths } from "@/lib/theme";
import { columnSpaceBasis, nullSpaceBasis } from "@/lib/linalg";
import { useSceneStore } from "./sceneStore";

type Vec3 = [number, number, number];

const GRID_SIZE = 4;
const GRID_DIVISIONS = 8;

function standardBasis(n: number): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const e: Vec3 = [0, 0, 0];
    e[i] = 1;
    out.push(e);
  }
  return out;
}

function matrixColumns(matrix: number[][], m: number, n: number): Vec3[] {
  const out: Vec3[] = [];
  for (let c = 0; c < n; c++) {
    const v: Vec3 = [0, 0, 0];
    for (let r = 0; r < m && r < 3; r++) v[r] = matrix[r][c];
    out.push(v);
  }
  return out;
}

const BRIGHT_COLORS = [palette.yellow, palette.green, palette.red] as const;
const FADED_COLORS = [
  "rgb(255, 216, 102, 0.45)",
  "rgb(124, 219, 138, 0.45)",
  "rgb(229, 91, 106, 0.45)",
] as const;

export function RankNullityScene() {
  const n = useSceneStore((s) => s.n);
  const m = useSceneStore((s) => s.m);
  const matrix = useSceneStore((s) => s.matrix);

  const basisE = useMemo(() => standardBasis(n), [n]);
  const columns = useMemo(() => matrixColumns(matrix, m, n), [matrix, m, n]);
  const nullBasis = useMemo(() => nullSpaceBasis(matrix), [matrix]);
  const colBasis = useMemo(() => columnSpaceBasis(matrix), [matrix]);

  return (
    <SceneCanvas cameraPosition={[5, 4, 10]} fov={40}>
      {/* Reference grid + axes — the unmoved background coordinate system */}
      <Grid
        size={GRID_SIZE}
        divisions={GRID_DIVISIONS}
        color={palette.gridDim}
        lineWidth={lineWidths.thin}
      />
      <Axes length={GRID_SIZE * 0.95} dim={3} lineWidth={lineWidths.thin} />

      {/* Transformed grid — morphs from identity to M·grid */}
      <TransformedGrid
        matrix={matrix}
        n={n}
        m={m}
        size={GRID_SIZE}
        divisions={GRID_DIVISIONS}
        color={palette.grid}
        lineWidth={lineWidths.normal}
      />

      {/* Standard basis e_i — what the inputs look like (faint) */}
      {basisE.map((e, i) => (
        <VectorArrow
          key={`e-${i}`}
          to={e}
          color={FADED_COLORS[i]}
          lineWidth={lineWidths.thin}
          headSize={0.13}
        />
      ))}

      {/* Column vectors M e_i — what the outputs are (bright, animated) */}
      {columns.map((c, i) => (
        <VectorArrow
          key={`col-${i}`}
          to={c}
          color={BRIGHT_COLORS[i]}
          lineWidth={lineWidths.thick}
          headSize={0.2}
        />
      ))}

      {/* Null space (in domain): yellow */}
      <SubspaceHighlight
        basis={nullBasis}
        color={palette.nullSpace}
        extent={GRID_SIZE}
        opacity={0.25}
      />

      {/* Column space (in codomain): blue */}
      <SubspaceHighlight
        basis={colBasis}
        color={palette.columnSpace}
        extent={GRID_SIZE}
        opacity={0.2}
      />
    </SceneCanvas>
  );
}
