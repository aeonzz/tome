import * as React from "react"
import type { DialogRootChangeEventDetails } from "@base-ui/react"
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
import { Kbd, KbdGroup } from "@tome/ui/components/kbd"
import { Page, PageSlide } from "@tome/ui/components/page-slide"
import { IconBookmarkPlus, IconSearch } from "@tome/ui/icons"

import type { ActionDefinition, ActionGroup } from "@/types/action-types"
import { NAV_ROUTES } from "@/config/constants"
import { ACTION_DEFINITIONS, actionRegistry } from "@/lib/action-registry"
import { useActionMenuStore, type MenuView } from "@/hooks/use-action-menu"

import { HotkeyBadge } from "../hotkey-badge"
import { CreateBookmarkView } from "./create-bookmark-view"

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
  const rootKeyRef = React.useRef(0)
  const nestedKeyRef = React.useRef(0)
  const navigate = useNavigate()
  const {
    open,
    query,
    view,
    selection,
    pageContext,
    openMenu,
    closeMenu,
    setQuery,
    setView,
    resetView,
    openNested,
  } = useActionMenuStore()

  const commandInputRef = React.useRef<HTMLInputElement>(null)

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
        if (def.context && def.context !== pageContext) return false
        if (def.requiresSelection) {
          return selection?.type === def.requiresSelection
        }
        return true
      }),
    })).filter((group) => group.items.length > 0)

    if (!selection) return groups

    const priorityGroup = GROUP_LABELS[selection.type as ActionGroup]
    return [
      ...groups.filter((g) => g.heading === priorityGroup),
      ...groups.filter((g) => g.heading !== priorityGroup),
    ]
  }, [selection, pageContext])

  function runCommand(fn: () => void) {
    closeMenu()
    setTimeout(fn, 50)
  }

  function handleSelect(def: ActionDefinition) {
    // Has children — open nested view
    if (def.children?.length) {
      nestedKeyRef.current += 1
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
      if (route) {
        runCommand(() => navigate({ to: route }))
        return
      }
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
        rootKeyRef.current += 1
        resetView()
        return
      }
    }

    nextOpen ? openMenu() : closeMenu()
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange as any}
      className="top-1/8 sm:max-w-2xl"
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
              <div
                key={
                  view.type === "nested"
                    ? `nested-${nestedKeyRef.current}`
                    : `root-${rootKeyRef.current}`
                }
                className="animate-dialog-press"
              >
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
              </div>
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
  )
}
