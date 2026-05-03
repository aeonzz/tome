import * as React from "react"
import type { PageContext } from "@/types/action-types"
import { useActionMenuStore } from "./use-action-menu"

export function usePageContext(ctx: PageContext) {
  const setPageContext = useActionMenuStore((s) => s.setPageContext)

  React.useEffect(() => {
    setPageContext(ctx)
    return () => setPageContext(null) 
  }, [ctx])
}