import * as React from "react"
import { ScrollArea } from "@base-ui/react"

import { cn } from "@tome/ui/lib/utils"

// function Shell({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="shell"
//       className={cn("mx-auto flex-1 w-full p-4 overflow-y-auto", className)}
//       {...props}
//     />
//   )
// }

// export { Shell }

function Shell({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <ScrollArea.Root className={cn("min-h-0 w-full", className)} {...props}>
      <ScrollArea.Viewport className="h-full mask-linear-[to_bottom,transparent_0,black_min(40px,var(--scroll-area-overflow-y-start)),black_calc(100%-min(40px,var(--scroll-area-overflow-y-end,40px))),transparent_100%] mask-no-repeat">
        <ScrollArea.Content className="px-4">{children}</ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="pointer-events-none m-1 flex w-1.5 justify-center rounded-sm bg-secondary opacity-0 transition-opacity duration-150 data-hovering:pointer-events-auto data-hovering:opacity-100 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0 before:absolute before:h-full before:w-5 before:content-['']">
        <ScrollArea.Thumb className="w-full rounded-sm bg-muted-foreground/50" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}

export { Shell }
