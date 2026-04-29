import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/wew')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_main/wew"!</div>
}
