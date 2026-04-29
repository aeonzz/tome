import { createFileRoute } from "@tanstack/react-router"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@tome/ui/components/card"
import { Shell } from "@tome/ui/components/shell"
import {
  IconArrowUpRight,
  IconBrandFigma,
  IconBrandGithub,
  IconBrandReact,
  IconBrandTailwind,
  IconBrandTypescript,
  IconBrandVite,
  IconCode,
  IconWorld,
} from "@tome/ui/icons"
import { cn } from "@tome/ui/lib/utils"

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
})

const FEATURED_BOOKMARK = {
  title: "Building the Next Generation of AI Agents",
  description:
    "Explore the architectural patterns and ethical considerations when designing autonomous coding assistants that can think, plan, and execute complex tasks.",
  url: "deepmind.google/blog",
  category: "Featured",
  icon: IconWorld,
  date: "Today's Pick",
}

const MOCK_BOOKMARKS = [
  {
    id: 1,
    title:
      "The Future of AI in Web Development asdsadaskhgdasjhdgashjkdgasjhkdgajskhdgasjhkgdajshkdgajkshgdasjhk",
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
    title: "Vite 6.0 Release Notes",
    url: "vitejs.dev",
    icon: IconBrandVite,
    category: "Dev",
    dateAdded: "2 days ago",
  },
  {
    id: 6,
    title: "Tailwind CSS v4 Roadmap",
    url: "tailwindcss.com",
    icon: IconBrandTailwind,
    category: "CSS",
    dateAdded: "3 days ago",
  },
  {
    id: 7,
    title: "TanStack Router Guide",
    url: "tanstack.com",
    icon: IconBrandTypescript,
    category: "Dev",
    dateAdded: "5 days ago",
  },
  {
    id: 8,
    title: "Github Copilot Extensions",
    url: "github.com",
    icon: IconBrandGithub,
    category: "Tools",
    dateAdded: "1 week ago",
  },
]

const MOCK_COLLECTIONS = [
  {
    id: 1,
    name: "Web Development",
    count: 42,
    icon: IconCode,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    id: 2,
    name: "UI Design",
    count: 18,
    icon: IconBrandFigma,
    color: "text-pink-500 bg-pink-500/10",
  },
  {
    id: 3,
    name: "AI Research",
    count: 7,
    icon: IconWorld,
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    id: 4,
    name: "Resources",
    count: 31,
    icon: IconBrandGithub,
    color: "text-orange-500 bg-orange-500/10",
  },
]

function RouteComponent() {
  return (
    <Shell>
      <div className="flex flex-col gap-10 py-6">
        {/* Featured Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground/80 tracking-tight">
              The Daily Read
            </span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
              Featured
            </span>
          </div>
          <Card
            tabIndex={0}
            className="relative overflow-hidden border-none bg-primary/3 ring-1 ring-primary/10 hover:ring-primary/20 focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-6">
              <IconArrowUpRight
                className="text-primary/40 group-hover:text-primary group-focus:text-primary transition-colors"
                size={24}
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                <FEATURED_BOOKMARK.icon size={22} />
              </div>
              <CardTitle className="text-xl font-bold tracking-tight">
                {FEATURED_BOOKMARK.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-4">
                {FEATURED_BOOKMARK.description}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-primary truncate max-w-50">
                  {FEATURED_BOOKMARK.url}
                </span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span className="text-[11px] font-medium text-muted-foreground">
                  {FEATURED_BOOKMARK.date}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collections Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground/80 tracking-tight">
              Collections
            </span>
            <button className="text-xs font-medium text-primary hover:underline transition-all">
              New Collection
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MOCK_COLLECTIONS.map((col) => (
              <div
                key={col.id}
                tabIndex={0}
                className="group relative flex items-center gap-3 rounded-xl p-3 bg-secondary/30 ring-1 ring-border/50 hover:ring-primary/10 hover:bg-secondary/50 focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all cursor-pointer overflow-hidden"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-110 group-focus:scale-110",
                    col.color
                  )}
                >
                  <col.icon size={20} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-sm font-semibold tracking-tight text-foreground/90">
                    {col.name}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {col.count} items
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground/80 tracking-tight">
              Recently added
            </span>
            <button className="text-xs font-medium text-primary hover:underline">
              View all
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MOCK_BOOKMARKS.map((bookmark) => (
              <Card
                key={bookmark.id}
                tabIndex={0}
                className="group relative flex flex-col justify-between cursor-pointer border-none bg-secondary/30 ring-1 ring-border/50 hover:ring-primary/10 hover:bg-secondary/50 focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all shadow-none"
                size="sm"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary ring-1 ring-primary/10">
                      <bookmark.icon size={18} />
                    </div>
                    <span className="rounded-full bg-secondary/50 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground ring-1 ring-border/50">
                      {bookmark.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1 overflow-hidden">
                    {(() => {
                      const isLong = bookmark.title.length > 28
                      return (
                        <div
                          className={cn(
                            "relative w-full overflow-hidden",
                            isLong && "t-text-fade"
                          )}
                          style={
                            isLong
                              ? {
                                  "--duration": `${Math.max(bookmark.title.length * 0.12, 2)}s`,
                                }
                              : (undefined as any)
                          }
                        >
                          <CardTitle
                            className={cn(
                              "inline-block w-max min-w-full whitespace-nowrap text-sm font-semibold leading-tight transition-transform",
                              isLong && "t-marquee-hover"
                            )}
                          >
                            {bookmark.title}
                          </CardTitle>
                        </div>
                      )
                    })()}
                    <span className="truncate text-[11px] text-muted-foreground">
                      {bookmark.url}
                    </span>
                  </div>
                </CardContent>
                <div className="flex items-center px-4 pb-4">
                  <span className="text-[10px] font-medium text-muted-foreground/70">
                    Added {bookmark.dateAdded}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  )
}
