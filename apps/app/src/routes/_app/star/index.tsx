import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/star/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/star/"!</div>
}
