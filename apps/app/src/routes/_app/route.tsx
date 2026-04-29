import * as React from "react"
import { getUser } from "@/functions/get-user"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@tome/ui/components/sidebar"

import { AppSidebar } from "@/components/app-sidebar"
import { CommandBar } from "@/components/command-bar"

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    const session = await getUser()
    if (!session) {
      throw redirect({
        to: "/sign-in",
      })
    }
    return { session }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [open, setOpen] = React.useState(false)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-4 px-4 justify-between">
          <SidebarTrigger />
          <CommandBar open={open} onOpenChange={setOpen} />
          {/* <ThemeToggle /> */}
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
