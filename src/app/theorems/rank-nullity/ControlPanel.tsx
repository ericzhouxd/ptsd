/**
 * ControlPanel — the contents of the floating panel for the Rank-Nullity scene.
 *
 * Just composes DimensionPicker + MatrixInput. The outer glass container and
 * collapse logic live in <FloatingControls>; this is the *content* slotted
 * into it.
 */
"use client";

import { DimensionPicker } from "@/scenes/rank-nullity/DimensionPicker";
import { MatrixInput } from "@/scenes/rank-nullity/MatrixInput";

export default function ControlPanel() {
  return (
    <div className="flex flex-col gap-5">
      <DimensionPicker />
      <MatrixInput />
    </div>
  );
}
