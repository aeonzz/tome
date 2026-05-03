import { createFileRoute } from "@tanstack/react-router"

import { usePageContext } from "@/hooks/use-page-context"

export const Route = createFileRoute("/_app/tags/")({
  component: RouteComponent,
})

function RouteComponent() {
  usePageContext("tags")
  return <div>Hello "/_app/tags/"!</div>
}
