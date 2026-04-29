import { getUser } from "@/functions/get-user"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const session = await getUser()
    if (session) {
      throw redirect({
        to: "/",
      })
    }
  },
})
