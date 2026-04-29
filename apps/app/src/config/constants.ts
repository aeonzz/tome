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

import type { RoutePath } from "@/types/route-type"

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
