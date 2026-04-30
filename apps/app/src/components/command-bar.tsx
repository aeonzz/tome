import * as React from "react"
import {
  BookmarkIcon,
  BookmarkPlusIcon,
  ClipboardIcon,
  ClockIcon,
  CopyIcon,
  ExternalLinkIcon,
  EyeIcon,
  FolderIcon,
  FolderInputIcon,
  FolderPlusIcon,
  GitMergeIcon,
  PencilIcon,
  SearchIcon,
  ShareIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@tome/ui/components/command"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@tome/ui/components/input-group"

interface CommandBarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandBar({ open, onOpenChange }: CommandBarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = React.useState("")
  const [view, setView] = React.useState<"list" | "create">("list")

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

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [onOpenChange, open])

  function runCommand(fn: () => void) {
    onOpenChange(false)
    setQuery("")
    fn()
  }

  return (
    <React.Fragment>
      <InputGroup
        className="w-full max-w-sm cursor-pointer select-none"
        onClick={() => onOpenChange(true)}
      >
        <InputGroupAddon>
          <SearchIcon className="size-4 opacity-50" />
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
        onOpenChange={(open) => {
          onOpenChange(open)
          if (!open) {
            setView("list")
            setQuery("")
          }
        }}
        className="top-1/7 sm:max-w-xl"
      >
        {view === "list" ? (
          <Command>
            <CommandInput
              placeholder="Type a command or paste a URL..."
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              {bookmarkUrl ? (
                <>
                  <CommandGroup heading="Create Bookmark">
                    <CommandItem
                      value={`create-bookmark-${bookmarkUrl}`}
                      onSelect={() => setView("create")}
                    >
                      <BookmarkPlusIcon />
                      <span>Create bookmark from pasted URL</span>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                </>
              ) : null}

              <CommandGroup heading="Navigation">
                <CommandItem
                  onSelect={() =>
                    runCommand(() => navigate({ to: "/collections" }))
                  }
                >
                  <FolderIcon />
                  <span>Go to Collections</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    runCommand(() => navigate({ to: "/bookmarks" }))
                  }
                >
                  <BookmarkIcon />
                  <span>View all bookmarks</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => runCommand(() => navigate({ to: "/recent" }))}
                >
                  <ClockIcon />
                  <span>View recently added</span>
                </CommandItem>
                <CommandItem
                  onSelect={() => runCommand(() => navigate({ to: "/recent" }))}
                >
                  <EyeIcon />
                  <span>View recently visited</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    runCommand(() =>
                      toast.info("Broken links scanner coming soon"),
                    )
                  }
                >
                  <TriangleAlertIcon />
                  <span>View broken links</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Bookmark Actions">
                <CommandItem
                  onSelect={() =>
                    runCommand(() =>
                      toast.info("Paste a URL to add a bookmark"),
                    )
                  }
                >
                  <BookmarkPlusIcon />
                  <span>Add new bookmark</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    runCommand(() => toast.info("Select a bookmark to edit"))
                  }
                >
                  <PencilIcon />
                  <span>Edit bookmark</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    runCommand(() => toast.info("Select a bookmark to delete"))
                  }
                >
                  <Trash2Icon />
                  <span>Delete bookmark</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    runCommand(() =>
                      toast.info("Select a bookmark to duplicate"),
                    )
                  }
                >
                  <CopyIcon />
                  <span>Duplicate bookmark</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    runCommand(() => toast.info("Select a bookmark to move"))
                  }
                >
                  <FolderInputIcon />
                  <span>Move to collection</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    runCommand(() =>
                      toast.info("Select a bookmark to copy its URL"),
                    )
                  }
                >
                  <ClipboardIcon />
                  <span>Copy URL to clipboard</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    runCommand(() => toast.info("Select a bookmark to open"))
                  }
                >
                  <ExternalLinkIcon />
                  <span>Open in new tab</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Collections">
                <CommandItem
                  onSelect={() =>
                    runCommand(() =>
                      toast.info("Enter a name for the new collection"),
                    )
                  }
                >
                  <FolderPlusIcon />
                  <span>New collection</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    runCommand(() =>
                      toast.info("Select a collection to rename"),
                    )
                  }
                >
                  <PencilIcon />
                  <span>Rename collection</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    runCommand(() =>
                      toast.info("Select a collection to delete"),
                    )
                  }
                >
                  <Trash2Icon />
                  <span>Delete collection</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    runCommand(() =>
                      toast.info("Select two collections to merge"),
                    )
                  }
                >
                  <GitMergeIcon />
                  <span>Merge two collections</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    runCommand(() =>
                      toast.info("Select a collection to share"),
                    )
                  }
                >
                  <ShareIcon />
                  <span>Share collection</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Create Bookmark</h2>
              <p className="text-sm text-muted-foreground">
                Enter the details for your new bookmark.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="url" className="text-sm font-medium">
                  URL
                </label>
                <input
                  id="url"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={bookmarkUrl ?? ""}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <input
                  id="title"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Bookmark title"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setView("list")}
                className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success("Bookmark created!")
                  onOpenChange(false)
                }}
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        )}
      </CommandDialog>
    </React.Fragment>
  )
}
