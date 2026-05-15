import { createFileRoute } from "@tanstack/react-router"

import { ListBox } from "@tome/ui/components/list-box"
import { Shell } from "@tome/ui/components/shell"
import {
  IconBrandFigma,
  IconBrandGithub,
  IconBrandReact,
  IconCode,
  IconWorld,
} from "@tome/ui/icons"

import { usePageContext } from "@/hooks/use-page-context"

import { BookmarkCard } from "./-components/bookmark-card"

export const Route = createFileRoute("/_app/bookmarks/")({
  component: RouteComponent,
})

const MOCK_BOOKMARKS = [
  {
    id: 1,
    title: "The Future of AI in Web Development",
    url: "techblog.com",
    icon: IconWorld,
    category: "Tech",
    dateAdded: "2 mins ago",
  },
  {
    id: 2,
    title: "Mastering React 19 Patterns",
    url: "react-patterns.dev",
    icon: IconBrandReact,
    category: "Dev",
    dateAdded: "1 hour ago",
  },
  {
    id: 3,
    title: "Minimalist UI Design Principles",
    url: "designportfolio.io",
    icon: IconBrandFigma,
    category: "Design",
    dateAdded: "3 hours ago",
  },
  {
    id: 4,
    title: "Modern Database Scaling",
    url: "db-docs.com",
    icon: IconCode,
    category: "Backend",
    dateAdded: "Yesterday",
  },
  {
    id: 5,
    title: "Github Copilot Extensions",
    url: "github.com",
    icon: IconBrandGithub,
    category: "Tools",
    dateAdded: "1 week ago",
  },
]

function RouteComponent() {
  usePageContext("bookmarks")

  return (
    <Shell className="px-2 flex flex-col">
      <div className="w-full py-2 px-3 h-10 flex items-center">
        <span className="text-sm font-medium">Bookmarks</span>
      </div>
      <ListBox
        items={MOCK_BOOKMARKS}
        onSelect={(item) => console.log("Selected:", item)}
        enableGlobalArrows={true}
      >
        {MOCK_BOOKMARKS.map((bookmark, index) => (
          <BookmarkCard key={bookmark.id} index={index} bookmark={bookmark} />
        ))}
      </ListBox>
    </Shell>
  )
}
