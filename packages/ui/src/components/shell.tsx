import * as React from "react"
import { ScrollArea } from "@base-ui/react"

import { cn } from "@tome/ui/lib/utils"

function Shell({ className, children, ...props }: React.ComponentProps<typeof ScrollArea.Content>) {
  return (
    <ScrollArea.Root className="min-h-0 w-full" {...props}>
      <ScrollArea.Viewport className="h-full mask-linear-[to_bottom,transparent_0,black_min(35px,var(--scroll-area-overflow-y-start)),black_calc(100%-min(35px,var(--scroll-area-overflow-y-end,35px))),transparent_100%] mask-no-repeat">
        <ScrollArea.Content className={cn("pl-2 pr-4", className)}>
          {children}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="pointer-events-none m-1 flex w-1.5 justify-center rounded-sm bg-transparent data-hovering:pointer-events-auto data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0 before:absolute before:h-full before:w-5 before:content-['']">
        <ScrollArea.Thumb className="w-full rounded-sm bg-secondary hover:bg-[color-mix(in_oklch,var(--secondary),var(--secondary-foreground)_15%)]" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}

export { Shell }
