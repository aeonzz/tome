import type { ActionDefinition } from "@/lib/action-registry";
import { create } from "zustand"

export type ComposeView = "bookmark" | "collection"

export type MenuView =
  | { type: "root" }
  | { type: "compose"; view: ComposeView }
  | { type: "nested"; parentId: string; items: ActionDefinition[]; heading: string }
  // | { type: "picker"; view: "collection" }

export type SelectionState = {
  type: "bookmark" | "collection" | "tag"
  id: string
} | null

interface ActionMenuState {
  open: boolean
  query: string
  view: MenuView
  selection: SelectionState

  openMenu: () => void
  openTo: (view: MenuView) => void
  closeMenu: () => void
  setQuery: (query: string) => void
  setView: (view: MenuView) => void
  resetView: () => void
  setSelection: (selection: SelectionState) => void
  openNested: (parentId: string, items: ActionDefinition[], heading: string) => void
}

export const useActionMenuStore = create<ActionMenuState>((set) => ({
  open: false,
  query: "",
  view: { type: "root" },
  selection: null,

  openMenu: () => set({ open: true, view: { type: "root" }, query: "" }),
  openTo: (view) => set({ open: true, query: "", view }),
  closeMenu: () => set({ open: false, view: { type: "root" }, query: "" }),
  setQuery: (query) => set({ query }),
  setView: (view) => set({ view }),
  resetView: () => set({ view: { type: "root" } }),
  setSelection: (selection) => set({ selection }),
  openNested: (parentId, items, heading) =>
    set({ view: { type: "nested", parentId, items, heading } }),
}))