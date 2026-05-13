/**
 * uiStore — tiny zustand store for the theorem page's view mode.
 *
 * Three modes — exactly one active at a time:
 *   • "statement" — the statement wall is up, scene hidden behind it
 *   • "scene"     — bare scene with controls; the user is exploring
 *   • "proof"     — the proof wall is up, scene hidden behind it
 *
 * The SectionNav is the only thing that writes `mode`. Walls, dim layer, and
 * FloatingControls all read it to decide their visibility. There's no
 * scroll-driven UI on theorem pages anymore — switching is exclusively via
 * the side nav (this avoids the wheel-zoom-vs-scroll conflict from the
 * previous design).
 */
import { create } from "zustand";

export type Mode = "statement" | "scene" | "proof";

type UiState = {
  mode: Mode;
  setMode: (m: Mode) => void;
};

export const useUiStore = create<UiState>((set) => ({
  mode: "statement",
  setMode: (mode) => set({ mode }),
}));
