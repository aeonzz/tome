import { createFileRoute } from "@tanstack/react-router"

import { usePageContext } from "@/hooks/use-page-context"

export const Route = createFileRoute("/_app/star/")({
  component: RouteComponent,
})

function RouteComponent() {
  usePageContext("star")
  return <div>Hello "/_app/star/"!</div>
}
