/**
 * Rank-Nullity theorem page.
 *
 * Layout: nothing scrolls. Everything is a fixed-positioned overlay on top of
 * the live scene. SectionNav switches between three modes — statement, scene,
 * proof — by writing to uiStore. Each wall reads that mode and either fades
 * in (opacity 1, pointer-events auto) or fades out (opacity 0, pointer-events
 * none).
 *
 * Visual stacking, back to front:
 *   z-0   — canvas (TheoremBackground)
 *   z-1   — dim layer (covers canvas while a wall is active)
 *   z-10  — statement wall
 *   z-10  — proof wall (same layer; only one is visible at a time)
 *   z-20  — FloatingControls (visible only in scene mode)
 *   z-30  — SectionNav (always visible — the only switch)
 *
 * This is a SERVER component. Statement and proof MDX render at build time;
 * the client-only pieces (Scene, ControlPanel) live behind their own files.
 *
 * See LEARNING.md §"The theorem-page layout".
 */
import Statement from "./statement.mdx";
import Proof from "./proof.mdx";
import Scene from "./Scene";
import ControlPanel from "./ControlPanel";
import { TheoremBackground } from "@/components/theorem/TheoremBackground";
import { StatementOverlay } from "@/components/theorem/StatementOverlay";
import { ProofOverlay } from "@/components/theorem/ProofOverlay";
import { FloatingControls } from "@/components/theorem/FloatingControls";
import { SectionNav } from "@/components/theorem/SectionNav";

const NAV_TARGETS = [
  { id: "statement" as const, label: "Statement" },
  { id: "scene" as const, label: "Scene" },
  { id: "proof" as const, label: "Proof" },
];

export default function Page() {
  return (
    <>
      <TheoremBackground>
        <Scene />
      </TheoremBackground>

      <FloatingControls>
        <ControlPanel />
      </FloatingControls>

      <SectionNav targets={NAV_TARGETS} />

      <StatementOverlay title="Rank-Nullity Theorem">
        <Statement />
      </StatementOverlay>

      <ProofOverlay title="Proof">
        <Proof />
      </ProofOverlay>
    </>
  );
}
