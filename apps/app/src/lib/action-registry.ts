import type { Hotkey } from "@tanstack/react-hotkeys"

import {
  IconAlertTriangle,
  IconBookmarkPlus,
  IconBraces,
  IconBrandPocket,
  IconBrowser,
  IconClipboard,
  IconClock,
  IconCloud,
  IconCopy,
  IconDeviceDesktop,
  IconExternalLink,
  IconEye,
  IconFileCode,
  IconFileExport,
  IconFileImport,
  IconFileText,
  IconFolder,
  IconFolderPlus,
  IconFolderSymlink,
  IconGitMerge,
  IconKeyboard,
  IconLogout,
  IconMessageCircle,
  IconMoon,
  IconPencil,
  IconSettings,
  IconShare,
  IconSparkles,
  IconSun,
  IconTrash,
  IconUser,
  type IconProps,
} from "@tome/ui/icons"

export type IconComponent = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>

export type Shortcut =
  | { type: "chord"; value: Hotkey }
  | { type: "sequence"; value: [Hotkey, Hotkey] }

export type SelectionContext = "bookmark" | "collection" | "tag"

export type ActionGroup =
  | "navigation"
  | "bookmark"
  | "collection"
  | "tag"
  | "general"

/**
 * An ActionDefinition is pure, static data.
 * It describes an action but knows nothing about how to execute it.
 * Handlers are registered separately via ActionRegistry.
 */
export type ActionDefinition = {
  /** Stable unique identifier — used to register handlers */
  id: string
  label: string
  icon: IconComponent
  group: ActionGroup
  shortcut?: Shortcut
  /**
   * If set, this action is hidden from the command menu unless
   * the specified entity is currently selected.
   */
  requiresSelection?: SelectionContext
  /**
   * If set, this action opens a sub-view inside the command menu
   * instead of running a handler.
   */
  opensView?: string
  /** If set, selecting this item opens a nested list instead of executing */
  children?: ActionDefinition[]
}

// --------------- Definitions ---------------
// This array is the single source of truth for what actions exist.
// It is completely static — no functions, no closures, no imports from
// the rest of the app. Perfectly tree-shakeable and testable.

export const ACTION_DEFINITIONS: ActionDefinition[] = [
  // — Navigation —
  {
    id: "nav.collections",
    label: "Go to Collections",
    icon: IconFolder,
    group: "navigation",
    shortcut: { type: "sequence", value: ["G", "G"] },
  },
  {
    id: "nav.bookmarks",
    label: "View all bookmarks",
    icon: IconBookmarkPlus,
    group: "navigation",
    shortcut: { type: "sequence", value: ["G", "B"] },
  },
  {
    id: "nav.recent",
    label: "View recently added",
    icon: IconClock,
    group: "navigation",
    shortcut: { type: "sequence", value: ["G", "R"] },
  },
  {
    id: "nav.visited",
    label: "View recently visited",
    icon: IconEye,
    group: "navigation",
    shortcut: { type: "sequence", value: ["G", "V"] },
  },
  {
    id: "nav.broken",
    label: "View broken links",
    icon: IconAlertTriangle,
    group: "navigation",
    shortcut: { type: "sequence", value: ["G", "L"] },
  },

  // — Bookmark Actions —
  {
    id: "bookmark.create",
    label: "Add new bookmark",
    icon: IconBookmarkPlus,
    group: "bookmark",
    shortcut: { type: "chord", value: "C" },
    opensView: "compose.bookmark",
  },
  {
    id: "bookmark.edit",
    label: "Edit bookmark",
    icon: IconPencil,
    group: "bookmark",
    requiresSelection: "bookmark",
  },
  {
    id: "bookmark.delete",
    label: "Delete bookmark",
    icon: IconTrash,
    group: "bookmark",
    requiresSelection: "bookmark",
  },
  {
    id: "bookmark.duplicate",
    label: "Duplicate bookmark",
    icon: IconCopy,
    group: "bookmark",
    requiresSelection: "bookmark",
  },
  {
    id: "bookmark.move",
    label: "Move to collection",
    icon: IconFolderSymlink,
    group: "bookmark",
    requiresSelection: "bookmark",
    opensView: "picker.collection",
  },
  {
    id: "bookmark.copy-url",
    label: "Copy URL to clipboard",
    icon: IconClipboard,
    group: "bookmark",
    shortcut: { type: "chord", value: "Mod+C" },
    requiresSelection: "bookmark",
  },
  {
    id: "bookmark.open",
    label: "Open in new tab",
    icon: IconExternalLink,
    group: "bookmark",
    requiresSelection: "bookmark",
  },
  {
    id: "bookmark.import",
    label: "Import bookmarks",
    icon: IconFileImport,
    group: "general",
    children: [
      { id: "import.browser", label: "From browser", icon: IconBrowser, group: "general" },
      { id: "import.raindrop", label: "From Raindrop", icon: IconCloud, group: "general" },
      { id: "import.pocket", label: "From Pocket", icon: IconBrandPocket, group: "general" },
      { id: "import.csv", label: "From CSV", icon: IconFileText, group: "general" },
    ],
  },
  {
    id: "bookmark.export",
    label: "Export bookmarks",
    icon: IconFileExport,
    group: "general",
    children: [
      { id: "export.html", label: "As HTML", icon: IconFileCode, group: "general" },
      { id: "export.csv", label: "As CSV", icon: IconFileText, group: "general" },
      { id: "export.json", label: "As JSON", icon: IconBraces, group: "general" },
    ],
  },

  // — Collection Actions —
  {
    id: "collection.create",
    label: "New collection",
    icon: IconFolderPlus,
    group: "collection",
    opensView: "compose.collection",
  },
  {
    id: "collection.rename",
    label: "Rename collection",
    icon: IconPencil,
    group: "collection",
    requiresSelection: "collection",
  },
  {
    id: "collection.delete",
    label: "Delete collection",
    icon: IconTrash,
    group: "collection",
    requiresSelection: "collection",
  },
  {
    id: "collection.merge",
    label: "Merge two collections",
    icon: IconGitMerge,
    group: "collection",
    requiresSelection: "collection",
  },
  {
    id: "collection.share",
    label: "Share collection",
    icon: IconShare,
    group: "collection",
    requiresSelection: "collection",
  },

  // — General —
  {
    id: "theme",
    label: "Change theme",
    icon: IconSun,
    group: "general",
    children: [
      { id: "theme.light", label: "Light", icon: IconSun, group: "general" },
      { id: "theme.dark", label: "Dark", icon: IconMoon, group: "general" },
      { id: "theme.system", label: "System", icon: IconDeviceDesktop, group: "general" },
    ],
  },
  {
    id: "general.shortcuts",
    label: "View keyboard shortcuts",
    icon: IconKeyboard,
    group: "general",
    shortcut: { type: "chord", value: "Mod+," },
  },
  {
    id: "general.feedback",
    label: "Send feedback",
    icon: IconMessageCircle,
    group: "general",
  },
  {
    id: "general.changelog",
    label: "View changelog",
    icon: IconSparkles,
    group: "general",
  },
  {
    id: "general.settings",
    label: "Open settings",
    icon: IconSettings,
    group: "general",
    shortcut: { type: "sequence", value: ["G", "S"] },
  },
  {
    id: "general.profile",
    label: "Manage account",
    icon: IconUser,
    group: "general",
  },
  {
    id: "general.signout",
    label: "Sign out",
    icon: IconLogout,
    group: "general",
  },
]

// --------------- Registry ---------------
// Maps action IDs → handler functions.
// Components register handlers when they mount and unregister on unmount,
// so the registry always reflects what's currently mounted and capable
// of handling an action.

type Handler = () => void

export class ActionRegistry {
  private handlers = new Map<string, Handler>()

  register(id: string, handler: Handler): () => void {
    this.handlers.set(id, handler)
    // Return an unregister function for use in useEffect cleanup
    return () => this.handlers.delete(id)
  }

  execute(id: string): boolean {
    const handler = this.handlers.get(id)
    if (!handler) return false
    handler()
    return true
  }

  has(id: string): boolean {
    return this.handlers.has(id)
  }
}

// A single shared instance. Provide this via context in your app.
export const actionRegistry = new ActionRegistry()
