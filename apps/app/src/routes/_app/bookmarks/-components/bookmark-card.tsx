import * as React from "react"

import { ListBoxItem } from "@tome/ui/components/list-box"
import { cn } from "@tome/ui/lib/utils"

interface BookmarkCardProps extends React.ComponentProps<typeof ListBoxItem> {
  bookmark: any
}

export function BookmarkCard({
  bookmark,
  className,
  ...props
}: BookmarkCardProps) {
  return (
    <ListBoxItem
      key={bookmark.id}
      className={cn(
        "data-active:not-data-selected:bg-muted dark:data-active:not-data-selected:bg-muted/50 data-active:text-foreground data-[kb-visible=true]:ring-ring/50 [&_svg]:text-muted-foreground data-selected:bg-muted dark:not-data-selected:data-popup-open:bg-muted/50 not-data-selected:data-popup-open:bg-muted flex items-center gap-2 px-2 py-1.5 text-sm outline-none select-none data-[kb-visible=true]:ring-1 data-[kb-visible=true]:ring-inset [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 rounded-md",
        className
      )}
      {...props}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary ring-1 ring-primary/10 transition-colors group-hover:bg-primary/10 group-data-[active=true]:bg-primary/20">
        <bookmark.icon size={20} />
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate text-sm font-semibold tracking-tight text-foreground/90">
          {bookmark.title}
        </span>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="truncate">{bookmark.url}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-border" />
          <span>{bookmark.dateAdded}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 pr-2">
        <span className="rounded-full bg-secondary/50 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground ring-1 ring-border/50">
          {bookmark.category}
        </span>
      </div>
    </ListBoxItem>
  )
}
