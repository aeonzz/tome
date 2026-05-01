import type { Hotkey } from "@tanstack/react-hotkeys"

import {
  IconAlertTriangle,
  IconArchive,
  IconBookmark,
  IconBookmarkPlus,
  IconCategory,
  IconClipboard,
  IconClock,
  IconCopy,
  IconExternalLink,
  IconEye,
  IconFolder,
  IconFolderPlus,
  IconFolderSymlink,
  IconGitMerge,
  IconPencil,
  IconShare,
  IconStar,
  IconTag,
  IconTrash,
  type IconProps,
} from "@tome/ui/icons"

import type { RoutePath } from "@/types/route-type"
import type { ComposeView } from "@/hooks/use-action-menu"

type SidebarSubItem = {
  title: string
  url: string
}

type SidebarNavItem = {
  title: string
  url: RoutePath
  icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
  items?: Array<SidebarSubItem>
}

type SidebarItems = Record<string, SidebarNavItem[]>

export const SIDEBAR_ITEMS: SidebarItems = {
  core: [
    {
      title: "Home",
      url: "/",
      icon: IconCategory,
    },
    {
      title: "Bookmarks",
      url: "/bookmarks",
      icon: IconBookmark,
    },
    {
      title: "Collections",
      url: "/collections",
      icon: IconFolder,
    },
    {
      title: "Tags",
      url: "/tags",
      icon: IconTag,
    },
  ],
  views: [
    {
      title: "Star",
      url: "/star",
      icon: IconStar,
    },
    {
      title: "Recently added",
      url: "/recent",
      icon: IconClock,
    },
    {
      title: "Archive",
      url: "/archive",
      icon: IconArchive,
    },
  ],
}

export type ActionGroup = {
  heading: string
  items: Array<ActionItem>
}

export type Shortcut =
  | { type: "chord"; value: Hotkey }
  | { type: "sequence"; value: Hotkey[] }

export type ActionItem = {
  icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
  label: string
  onSelect: () => void
  shortcut?: Shortcut
}

type ActionGroupArgs = {
  runCommand: (command: () => void) => void
  navigate: ({ to }: { to: RoutePath }) => void
  toast: {
    info: (message: string) => void
    error: (message: string) => void
  }
  setView: (view: "root" | "compose", composeView?: ComposeView) => void
}

export const getActionGroups = ({
  runCommand,
  navigate,
  toast,
  setView,
}: ActionGroupArgs): Array<ActionGroup> => [
  {
    heading: "Navigation",
    items: [
      {
        icon: IconFolder,
        label: "Go to Collections",
        shortcut: { type: "sequence", value: ["G", "G"] },
        onSelect: () => runCommand(() => navigate({ to: "/collections" })),
      },
      {
        icon: IconBookmark,
        label: "View all bookmarks",
        shortcut: { type: "sequence", value: ["G", "B"] },
        onSelect: () => runCommand(() => navigate({ to: "/bookmarks" })),
      },
      {
        icon: IconClock,
        label: "View recently added",
        shortcut: { type: "sequence", value: ["G", "R"] },
        onSelect: () => runCommand(() => navigate({ to: "/recent" })),
      },
      {
        icon: IconEye,
        label: "View recently visited",
        shortcut: { type: "sequence", value: ["G", "V"] },
        onSelect: () => runCommand(() => navigate({ to: "/recent" })),
      },
      {
        icon: IconAlertTriangle,
        label: "View broken links",
        shortcut: { type: "sequence", value: ["G", "L"] },
        onSelect: () =>
          runCommand(() => toast.info("Broken links scanner coming soon")),
      },
    ],
  },
  {
    heading: "Bookmark Actions",
    items: [
      {
        icon: IconBookmarkPlus,
        label: "Add new bookmark",
        shortcut: { type: "chord", value: "C" },
        onSelect: () => setView("compose", "bookmark"),
      },
      {
        icon: IconPencil,
        label: "Edit bookmark",
        onSelect: () =>
          runCommand(() => toast.info("Select a bookmark to edit")),
      },
      {
        icon: IconTrash,
        label: "Delete bookmark",
        onSelect: () =>
          runCommand(() => toast.info("Select a bookmark to delete")),
      },
      {
        icon: IconCopy,
        label: "Duplicate bookmark",
        onSelect: () =>
          runCommand(() => toast.info("Select a bookmark to duplicate")),
      },
      {
        icon: IconFolderSymlink,
        label: "Move to collection",
        onSelect: () =>
          runCommand(() => toast.info("Select a bookmark to move")),
      },
      {
        icon: IconClipboard,
        label: "Copy URL to clipboard",
        shortcut: { type: "chord", value: "Mod+C" },
        onSelect: () =>
          runCommand(() => toast.info("Select a bookmark to copy its URL")),
      },
      {
        icon: IconExternalLink,
        label: "Open in new tab",
        onSelect: () =>
          runCommand(() => toast.info("Select a bookmark to open")),
      },
    ],
  },
  {
    heading: "Collections",
    items: [
      {
        icon: IconFolderPlus,
        label: "New collection",
        onSelect: () => setView("compose", "collection"),
      },
      {
        icon: IconPencil,
        label: "Rename collection",
        onSelect: () =>
          runCommand(() => toast.info("Select a collection to rename")),
      },
      {
        icon: IconTrash,
        label: "Delete collection",
        onSelect: () =>
          runCommand(() => toast.info("Select a collection to delete")),
      },
      {
        icon: IconGitMerge,
        label: "Merge two collections",
        onSelect: () =>
          runCommand(() => toast.info("Select two collections to merge")),
      },
      {
        icon: IconShare,
        label: "Share collection",
        onSelect: () =>
          runCommand(() => toast.info("Select a collection to share")),
      },
    ],
  },
]
