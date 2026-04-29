import SignUpForm from "@/components/sign-up-form"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/sign-up")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-svh items-center justify-center py-12">
      <SignUpForm />
    </div>
  )
}
