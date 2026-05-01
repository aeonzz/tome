import { create } from "zustand"

export type ComposeView = "bookmark" | "collection"

interface ActionMenuState {
  view: "root" | "compose"
  composeView: ComposeView | null
  setView: (view: "root" | "compose", composeView?: ComposeView) => void
}

export const useActionMenuStore = create<ActionMenuState>((set) => ({
  view: "root",
  composeView: null,
  setView: (view, composeView) =>
    set({ view, composeView: composeView ?? null }),
}))
