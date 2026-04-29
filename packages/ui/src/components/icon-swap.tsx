import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@tome/ui/lib/utils"

interface IconSwapProps extends useRender.ComponentProps<"div"> {
  state: "a" | "b"
}

export function IconSwap({
  state,
  className,
  render,
  ...props
}: IconSwapProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn("t-icon-swap", className),
      },
      props
    ),
    render,
    state: {
      state,
    },
  })
}

interface IconSwapItemProps extends useRender.ComponentProps<"span"> {
  icon: "a" | "b"
}

export function IconSwapItem({
  icon,
  className,
  render,
  ...props
}: IconSwapItemProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn("t-icon flex items-center justify-center", className),
      },
      props
    ),
    render,
    state: {
      icon,
    },
  })
}
