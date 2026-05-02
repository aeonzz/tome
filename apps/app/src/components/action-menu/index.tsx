import * as React from "react"
import type { DialogRootChangeEventDetails } from "@base-ui/react"
import { useHotkey } from "@tanstack/react-hotkeys"
import { useNavigate } from "@tanstack/react-router"

import {
  Command,
  CommandDialog,
  CommandDialogFooter,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@tome/ui/components/command"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@tome/ui/components/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@tome/ui/components/input-group"
import { Kbd, KbdGroup } from "@tome/ui/components/kbd"
import { Page, PageSlide } from "@tome/ui/components/page-slide"
import { IconBookmarkPlus, IconSearch } from "@tome/ui/icons"

import { ACTION_DEFINITIONS, actionRegistry } from "@/lib/action-registry"
import type { ActionDefinition, ActionGroup } from "@/lib/action-registry"
import { useActionMenuStore, type MenuView } from "@/hooks/use-action-menu"

import { HotkeyBadge } from "../hotkey-badge"
import { CreateBookmarkView } from "./create-bookmark-view"

export const NAV_ROUTES: Record<string, string> = {
  "nav.collections": "/collections",
  "nav.bookmarks": "/bookmarks",
  "nav.recent": "/recent",
  "nav.visited": "/recent",
  "nav.broken": "/broken",
}

const GROUP_ORDER: ActionGroup[] = [
  "navigation",
  "bookmark",
  "collection",
  "tag",
  "general",
]

const GROUP_LABELS: Record<ActionGroup, string> = {
  navigation: "Navigation",
  bookmark: "Bookmark Actions",
  collection: "Collections",
  tag: "Tags",
  general: "General",
}

const ACTION_GROUPS = buildActionGroups(ACTION_DEFINITIONS)

function parseBookmarkUrl(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  try {
    const url = new URL(trimmed)
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null
  } catch {
    return null
  }
}

function buildActionGroups(defs: ActionDefinition[]) {
  const byGroup = new Map<ActionGroup, ActionDefinition[]>()
  for (const def of defs) {
    if (!byGroup.has(def.group)) byGroup.set(def.group, [])
    byGroup.get(def.group)!.push(def)
  }
  return GROUP_ORDER.filter((g) => byGroup.has(g)).map((g) => ({
    heading: GROUP_LABELS[g],
    items: byGroup.get(g)!,
  }))
}

function parseMenuView(opensView: string): MenuView {
  const [type, subView] = opensView.split(".")
  if (type === "compose")
    return { type: "compose", view: subView as "bookmark" | "collection" }
  // if (type === "picker")
  //   return { type: "picker", view: subView as "collection" }
  return { type: "root" }
}

export function ActionMenu() {
  const navigate = useNavigate()
  const {
    open,
    query,
    view,
    selection,
    openMenu,
    closeMenu,
    setQuery,
    setView,
    resetView,
    openNested
  } = useActionMenuStore()

  const commandInputRef = React.useRef<HTMLInputElement>(null)

  useHotkey("Mod+K", (e) => {
    e.preventDefault()
    open ? closeMenu() : openMenu()
  })

  React.useEffect(() => {
    if (!open) return

    if (view.type === "compose") return // autoFocus on the form input handles this

    // view.type === "root" — wait for the slide-back animation to finish
    const id = setTimeout(() => {
      commandInputRef.current?.focus()
      commandInputRef.current?.select()
    }, 150)

    return () => clearTimeout(id)
  }, [open, view.type])

  const bookmarkUrl = parseBookmarkUrl(query)

  const visibleGroups = React.useMemo(() => {
    const groups = ACTION_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((def) => {
        if (def.requiresSelection) {
          return selection?.type === def.requiresSelection
        }
        return true
      }),
    })).filter((group) => group.items.length > 0)

    if (!selection) return groups

    // Bubble the selected entity's group to the top
    const priorityGroup = GROUP_LABELS[selection.type as ActionGroup]
    return [
      ...groups.filter((g) => g.heading === priorityGroup),
      ...groups.filter((g) => g.heading !== priorityGroup),
    ]
  }, [selection])

  function runCommand(fn: () => void) {
    closeMenu()
    setTimeout(fn, 50)
  }

  function handleSelect(def: ActionDefinition) {
    // Has children — open nested view
    if (def.children?.length) {
      openNested(def.id, def.children, def.label)
      setQuery("") 
      return
    }

    if (def.opensView) {
      setView(parseMenuView(def.opensView))
      return
    }

    if (def.id.startsWith("nav.")) {
      const route = NAV_ROUTES[def.id]
      if (route) runCommand(() => navigate({ to: route }))
      return
    }

    const handled = actionRegistry.execute(def.id)
    if (handled) runCommand(() => {})
  }

  function handleOpenChange(
    nextOpen: boolean,
    e?: DialogRootChangeEventDetails
  ) {
    if (!nextOpen && e?.reason === "escape-key") {
      e.event?.preventDefault()

      if (view.type === "compose") {
        resetView()
        return
      }

      if (query) {
        setQuery("")
        return
      }

      if (view.type === "nested") {
        resetView()
        return
      }
    }

    nextOpen ? openMenu() : closeMenu()
  }

  return (
    <>
      <InputGroup
        className="w-full max-w-sm cursor-pointer select-none"
        onClick={openMenu}
      >
        <InputGroupAddon>
          <IconSearch className="size-4 opacity-50" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search..."
          readOnly
          className="cursor-pointer"
        />
        <InputGroupAddon align="inline-end">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </InputGroupAddon>
      </InputGroup>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange as any}
        className="top-1/7 sm:max-w-2xl"
      >
        <PageSlide activePage={view.type === "nested" ? "root" : view.type}>
          <Page id="root">
            <Command>
              <CommandInput
                ref={commandInputRef}
                placeholder="Type a command or paste a URL..."
                value={query}
                onValueChange={setQuery}
              />
              <CommandList>
                <CommandEmpty>
                  <Empty className="border-none shadow-none py-24">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <IconSearch />
                      </EmptyMedia>
                      <EmptyTitle>No results found</EmptyTitle>
                      <EmptyDescription>
                        We couldn&apos;t find anything matching your search.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </CommandEmpty>
                {view.type === "nested" ? (
                  <CommandGroup heading={view.heading}>
                    {view.items.map((def) => (
                      <CommandItem
                        key={def.id}
                        onSelect={() => handleSelect(def)}
                      >
                        <def.icon />
                        <span>{def.label}</span>
                        {def.shortcut && (
                          <CommandShortcut>
                            <HotkeyBadge shortcut={def.shortcut} />
                          </CommandShortcut>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <React.Fragment>
                    {bookmarkUrl && (
                      <CommandGroup heading="Bookmark Actions">
                        <CommandItem
                          value={`add-bookmark-${bookmarkUrl}`}
                          onSelect={() =>
                            setView({ type: "compose", view: "bookmark" })
                          }
                        >
                          <IconBookmarkPlus />
                          <span>Add new bookmark</span>
                          <CommandShortcut>
                            <HotkeyBadge
                              shortcut={{ type: "chord", value: "C" }}
                            />
                          </CommandShortcut>
                        </CommandItem>
                      </CommandGroup>
                    )}
                    {visibleGroups.map((group) => (
                      <CommandGroup key={group.heading} heading={group.heading}>
                        {group.items.map((def) => (
                          <CommandItem
                            key={def.id}
                            onSelect={() => handleSelect(def)}
                          >
                            <def.icon />
                            <span>{def.label}</span>
                            {def.shortcut && (
                              <CommandShortcut>
                                <HotkeyBadge shortcut={def.shortcut} />
                              </CommandShortcut>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </React.Fragment>
                )}
              </CommandList>
            </Command>
            <CommandDialogFooter>
              <div className="flex items-center gap-2">
                <Kbd className="text-[10px] font-bold">↵</Kbd>
                <span>to select</span>
              </div>
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd className="text-[10px] font-bold">↑</Kbd>
                  <Kbd className="text-[10px] font-bold">↓</Kbd>
                </KbdGroup>
                <span>to navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <Kbd className="text-[10px] font-bold uppercase">esc</Kbd>
                <span>to close</span>
              </div>
            </CommandDialogFooter>
          </Page>
          <Page id="compose">
            {view.type === "compose" && view.view === "bookmark" && (
              <CreateBookmarkView
                defaultUrl={bookmarkUrl ?? ""}
                onSuccess={() => {
                  closeMenu()
                  setQuery("")
                }}
                onBack={resetView}
              />
            )}
            {view.type === "compose" && view.view === "collection" && (
              <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-sm font-medium text-foreground">
                    Create Collection
                  </div>
                  <div className="text-xs">
                    The collection creation form is under construction.
                  </div>
                  <button
                    onClick={resetView}
                    className="mt-4 text-xs font-semibold text-primary hover:underline"
                  >
                    Go back
                  </button>
                </div>
              </div>
            )}
          </Page>
        </PageSlide>
      </CommandDialog>
    </>
  )
}
