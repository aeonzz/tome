import { createFileRoute } from "@tanstack/react-router"

import SignInForm from "@/components/sign-in-form"

export const Route = createFileRoute("/_auth/sign-in")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh items-center justify-center py-12">
      <SignInForm />
    </div>
  )
}
