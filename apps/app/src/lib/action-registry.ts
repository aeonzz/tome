import { NAV_ACTION_DEFINITIONS } from "@/config/constants"
import type {
  ActionDefinition,
} from "@/types/action-types"

import {
  IconAlertTriangle,
  IconBookmarkPlus,
  IconBraces,
  IconBrandPocket,
  IconBrowser,
  IconClipboard,
  IconCloud,
  IconCopy,
  IconDeviceDesktop,
  IconExternalLink,
  IconEye,
  IconFileCode,
  IconFileExport,
  IconFileImport,
  IconFileText,
  IconFolderPlus,
  IconFolderSymlink,
  IconGitMerge,
  IconKeyboard,
  IconLayoutSidebar,
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
} from "@tome/ui/icons"

// --------------- Definitions ---------------
// This array is the single source of truth for what actions exist.
// It is completely static — no functions, no closures, no imports from
// the rest of the app. Perfectly tree-shakeable and testable.

export const ACTION_DEFINITIONS: ActionDefinition[] = [
  // — Navigation (derived from SIDEBAR_ITEMS in constants.ts) —
  ...NAV_ACTION_DEFINITIONS,
  // Non-sidebar nav actions
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
  {
    id: "nav.sidebar",
    label: "Toggle sidebar",
    icon: IconLayoutSidebar,
    group: "navigation",
    shortcut: { type: "chord", value: "Mod+B" },
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
    context: "bookmarks",
    requiresSelection: "bookmark",
  },
  {
    id: "bookmark.delete",
    label: "Delete bookmark",
    icon: IconTrash,
    group: "bookmark",
    context: "bookmarks",
    requiresSelection: "bookmark",
  },
  {
    id: "bookmark.duplicate",
    label: "Duplicate bookmark",
    icon: IconCopy,
    group: "bookmark",
    context: "bookmarks",
    requiresSelection: "bookmark",
  },
  {
    id: "bookmark.move",
    label: "Move to collection",
    icon: IconFolderSymlink,
    group: "bookmark",
    context: "bookmarks",
    requiresSelection: "bookmark",
    opensView: "picker.collection",
  },
  {
    id: "bookmark.copy-url",
    label: "Copy URL to clipboard",
    icon: IconClipboard,
    group: "bookmark",
    context: "bookmarks",
    shortcut: { type: "chord", value: "Mod+C" },
    requiresSelection: "bookmark",
  },
  {
    id: "bookmark.open",
    label: "Open in new tab",
    icon: IconExternalLink,
    group: "bookmark",
    context: "bookmarks",
    requiresSelection: "bookmark",
  },
  {
    id: "bookmark.import",
    label: "Import bookmarks",
    icon: IconFileImport,
    group: "general",
    context: "bookmarks",
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
    context: "bookmarks",
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
    context: "collections",
    opensView: "compose.collection",
  },
  {
    id: "collection.rename",
    label: "Rename collection",
    icon: IconPencil,
    group: "collection",
    context: "collections",
    requiresSelection: "collection",
  },
  {
    id: "collection.delete",
    label: "Delete collection",
    icon: IconTrash,
    group: "collection",
    context: "collections",
    requiresSelection: "collection",
  },
  {
    id: "collection.merge",
    label: "Merge two collections",
    icon: IconGitMerge,
    group: "collection",
    context: "collections",
    requiresSelection: "collection",
  },
  {
    id: "collection.share",
    label: "Share collection",
    icon: IconShare,
    group: "collection",
    context: "collections",
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
