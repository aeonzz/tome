import * as React from "react"
import type { DialogRootChangeEventDetails } from "@base-ui/react"
import { useHotkey } from "@tanstack/react-hotkeys"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

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
import { IconBookmarkPlus, IconSearch } from "@tome/ui/icons"

import { getActionGroups } from "@/config/constants"
import { Page, PageSlide } from "@tome/ui/components/page-slide"
import { useActionMenuStore } from "@/hooks/use-action-menu"

import { CreateBookmarkView } from "./create-bookmark-view"
import { HotkeyBadge } from "../hotkey-badge"

interface CommandBarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActionMenu({ open, onOpenChange }: CommandBarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = React.useState("")
  const { view, composeView, setView } = useActionMenuStore()

  useHotkey("Mod+K", (e) => {
    e.preventDefault()
    onOpenChange(!open)
  })

  const bookmarkUrl = React.useMemo(() => {
    const value = query.trim()

    if (!value) {
      return null
    }

    try {
      const parsed = new URL(value)
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return null
      }
      return parsed.toString()
    } catch {
      return null
    }
  }, [query])

  function handleOpenChange(
    nextOpen: boolean,
    e?: DialogRootChangeEventDetails
  ) {
    const isEscape = e?.reason === "escape-key"

    if (!nextOpen && view === "compose" && isEscape) {
      if (typeof e?.event?.preventDefault === "function") {
        e.event.preventDefault()
      }
      setView("root")

      setTimeout(() => {
        const input = document.querySelector(
          '[data-slot="command-input"]'
        ) as HTMLInputElement
        input?.focus()
        input?.select()
      }, 10)
      return
    }

    onOpenChange(nextOpen)
  }

  function runCommand(fn: () => void) {
    onOpenChange(false)
    setQuery("")
    fn()
  }

  const actionGroups = getActionGroups({
    runCommand,
    navigate: (to) => navigate(to),
    toast,
    setView,
  })

  React.useEffect(() => {
    if (!open) return

    setTimeout(() => {
      if (view === "root") {
        const input = document.querySelector(
          '[data-slot="command-input"]'
        ) as HTMLInputElement
        input?.focus()
        input?.select()
      } else if (view === "compose") {
        const input = document.querySelector(
          '#create-bookmark-form input[name="url"]'
        ) as HTMLInputElement
        input?.focus()
        input?.select()
      }
    }, 20)
  }, [open, view])

  return (
    <React.Fragment>
      <InputGroup
        className="w-full max-w-sm cursor-pointer select-none"
        onClick={() => onOpenChange(true)}
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
        <PageSlide activePage={view}>
          <Page id="root">
            <Command>
              <CommandInput
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
                {bookmarkUrl && (
                  <CommandGroup heading="Bookmark Actions">
                    <CommandItem
                      value={`add-bookmark-${bookmarkUrl}`}
                      onSelect={() => setView("compose", "bookmark")}
                    >
                      <IconBookmarkPlus />
                      <span>Add new bookmark</span>
                      <CommandShortcut>
                        <HotkeyBadge shortcut={{ type: "chord", value: "C" }} />
                      </CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                )}
                {actionGroups.map((group) => (
                  <CommandGroup key={group.heading} heading={group.heading}>
                    {group.items.map((item) => (
                      <CommandItem key={item.label} onSelect={item.onSelect}>
                        <item.icon />
                        <span>{item.label}</span>
                        {item.shortcut && (
                          <CommandShortcut>
                            <HotkeyBadge shortcut={item.shortcut} />
                          </CommandShortcut>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
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
            {composeView === "bookmark" && (
              <CreateBookmarkView
                defaultUrl={bookmarkUrl ?? ""}
                onSuccess={() => {
                  onOpenChange(false)
                  setQuery("")
                  setView("root")
                }}
                onBack={() => setView("root")}
              />
            )}
            {composeView === "collection" && (
              <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-sm font-medium text-foreground">
                    Create Collection
                  </div>
                  <div className="text-xs">
                    The collection creation form is under construction.
                  </div>
                  <button
                    onClick={() => setView("root")}
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
    </React.Fragment>
  )
}
