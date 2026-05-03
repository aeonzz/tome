import { createFileRoute } from "@tanstack/react-router"

import { usePageContext } from "@/hooks/use-page-context"
import { DotmCircular19 } from "@/components/dotm-circular-19"

export const Route = createFileRoute("/_app/collections/")({
  component: RouteComponent,
})

function RouteComponent() {
  usePageContext("collections")
  return <DotmCircular19 />
}
