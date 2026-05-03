import {
  IconArchive,
  IconBookmark,
  IconCategory,
  IconClock,
  IconFolder,
  IconStar,
  IconTag,
  type IconProps,
} from "@tome/ui/icons"

import type { ActionDefinition, Shortcut } from "@/types/action-types"
import type { RoutePath } from "@/types/route-type"

type SidebarSubItem = {
  title: string
  url: RoutePath
  icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
}

type SidebarNavItem = {
  title: string
  /** Label used in the action menu (falls back to title) */
  actionLabel?: string
  /** Items with sub-items act as expanders and don't need a URL */
  url?: RoutePath
  icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >
  /** Keyboard shortcut exposed in the action menu */
  shortcut?: Shortcut
  items?: Array<SidebarSubItem>
}

type SidebarItems = Record<string, SidebarNavItem[]>

export const SIDEBAR_ITEMS: SidebarItems = {
  core: [
    {
      title: "Home",
      actionLabel: "Go to Home",
      url: "/",
      icon: IconCategory,
      shortcut: { type: "sequence", value: ["G", "H"] },
    },
    {
      title: "Bookmarks",
      actionLabel: "View all bookmarks",
      url: "/bookmarks",
      icon: IconBookmark,
      shortcut: { type: "sequence", value: ["G", "B"] },
    },
    {
      title: "Tags",
      actionLabel: "Go to Tags",
      url: "/tags",
      icon: IconTag,
      shortcut: { type: "sequence", value: ["G", "T"] },
    },
    {
      title: "Collections",
      actionLabel: "Go to Collections",
      icon: IconFolder,
      shortcut: { type: "sequence", value: ["G", "G"] },
      items: [
        {
          title: "Design Inspiration",
          url: "/bookmarks",
          icon: IconFolder,
        },
        { title: "Dev Resources", url: "/bookmarks", icon: IconFolder },
        { title: "Reading List", url: "/bookmarks", icon: IconFolder },
        {
          title: "Tools & Utilities",
          url: "/bookmarks",
          icon: IconFolder,
        },
        { title: "Research", url: "/bookmarks", icon: IconFolder },
      ],
    },
  ],
  views: [
    {
      title: "Star",
      actionLabel: "Go to Starred",
      url: "/star",
      icon: IconStar,
    },
    {
      title: "Recently added",
      actionLabel: "View recently added",
      url: "/recent",
      icon: IconClock,
      shortcut: { type: "sequence", value: ["G", "R"] },
    },
    {
      title: "Archive",
      actionLabel: "Go to Archive",
      url: "/archive",
      icon: IconArchive,
    },
  ],
}

/** Flat list of all sidebar nav items (excluding sub-collection items) */
const FLAT_SIDEBAR_ITEMS = Object.values(SIDEBAR_ITEMS).flat()

/** nav.<slug> → route path — derived from SIDEBAR_ITEMS */
export const NAV_ROUTES: Record<string, string> = FLAT_SIDEBAR_ITEMS.flatMap(
  (item) => [item, ...(item.items ?? [])]
).reduce<Record<string, string>>((acc, item) => {
  if (!item.url) return acc
  const slug =
    item.url === "/" ? "home" : item.url.replace(/^\//, "").replace(/\//g, ".")
  acc[`nav.${slug}`] = item.url
  return acc
}, {})

/**
 * ActionDefinitions for all sidebar-based navigation actions.
 * Import this in action-registry.ts instead of hand-writing nav entries.
 */
export const NAV_ACTION_DEFINITIONS: ActionDefinition[] =
  FLAT_SIDEBAR_ITEMS.filter((item) => !!item.url).map((item) => {
    const slug =
      item.url === "/"
        ? "home"
        : item.url!.replace(/^\//, "").replace(/\//g, ".")
    return {
      id: `nav.${slug}`,
      label: item.actionLabel ?? item.title,
      icon: item.icon,
      group: "navigation" as const,
      ...(item.shortcut ? { shortcut: item.shortcut } : {}),
    }
  })
