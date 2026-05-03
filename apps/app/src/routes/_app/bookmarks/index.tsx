import { createFileRoute } from "@tanstack/react-router"

import { usePageContext } from "@/hooks/use-page-context"

export const Route = createFileRoute("/_app/bookmarks/")({
  component: RouteComponent,
})

function RouteComponent() {
  usePageContext("bookmarks")
  return <div>Hello "/_app/bookmarks/"!</div>
}
