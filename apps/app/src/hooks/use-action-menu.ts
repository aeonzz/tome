import { create } from "zustand"

import type { ActionDefinition, PageContext } from "@/types/action-types"

export type ComposeView = "bookmark" | "collection" | "import-browser"

export type MenuView =
  | { type: "root" }
  | { type: "compose"; view: ComposeView }
  | {
      type: "nested"
      parentId: string
      items: ActionDefinition[]
      heading: string
    }
// | { type: "picker"; view: "collection" }

export type SelectionState = {
  type: "bookmark" | "collection" | "tag"
  id: string
} | null

interface ActionMenuState {
  open: boolean
  query: string
  view: MenuView
  viewStack: MenuView[]
  selection: SelectionState
  isComposeLocked: boolean

  openMenu: () => void
  openTo: (view: MenuView) => void
  closeMenu: () => void
  setQuery: (query: string) => void
  setView: (view: MenuView) => void
  resetView: () => void
  goBack: () => void
  setSelection: (selection: SelectionState) => void
  setComposeLocked: (locked: boolean) => void
  openNested: (
    parentId: string,
    items: ActionDefinition[],
    heading: string
  ) => void
  pageContext: PageContext | null
  setPageContext: (ctx: PageContext | null) => void
}

export const useActionMenuStore = create<ActionMenuState>((set) => ({
  open: false,
  query: "",
  view: { type: "root" },
  viewStack: [],
  selection: null,
  isComposeLocked: false,

  openMenu: () => set({ open: true, view: { type: "root" }, viewStack: [], query: "", isComposeLocked: false }),
  openTo: (view) => set({ open: true, query: "", view, viewStack: [], isComposeLocked: false }),
  closeMenu: () => set({ open: false, query: "", isComposeLocked: false }),
  setQuery: (query) => set({ query }),
  setView: (view) => set((state) => ({ view, viewStack: [...state.viewStack, state.view] })),
  resetView: () => set({ view: { type: "root" }, viewStack: [], isComposeLocked: false }),
  goBack: () =>
    set((state) => {
      if (state.viewStack.length === 0) return { view: { type: "root" }, isComposeLocked: false }
      const newStack = [...state.viewStack]
      const prevView = newStack.pop()!
      return { view: prevView, viewStack: newStack, isComposeLocked: false }
    }),
  setSelection: (selection) => set({ selection }),
  setComposeLocked: (locked) => set({ isComposeLocked: locked }),
  openNested: (parentId, items, heading) =>
    set((state) => ({
      view: { type: "nested", parentId, items, heading },
      viewStack: [...state.viewStack, state.view],
    })),
  pageContext: null,
  setPageContext: (pageContext) => set({ pageContext }),
}))
