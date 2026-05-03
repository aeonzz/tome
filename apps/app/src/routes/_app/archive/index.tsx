import { createFileRoute } from "@tanstack/react-router"

import { usePageContext } from "@/hooks/use-page-context"

export const Route = createFileRoute("/_app/archive/")({
  component: RouteComponent,
})

function RouteComponent() {
  usePageContext("archive")
  return <div>Hello "/_app/archive/"!</div>
}
