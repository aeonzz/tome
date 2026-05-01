import * as React from "react"
import { getUser } from "@/functions/get-user"
import {
  useHotkey,
  useHotkeySequence,
  useHotkeySequences,
  type Hotkey,
} from "@tanstack/react-hotkeys"
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router"
import { toast } from "sonner"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@tome/ui/components/sidebar"

import { getActionGroups } from "@/config/constants"
import { useActionMenuStore } from "@/hooks/use-action-menu"
import { ActionMenu } from "@/components/action-menu"
import { AppSidebar } from "@/components/app-sidebar"
import { Error } from "@/components/error"
import { NotFound } from "@/components/not-found"

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
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(
        context.trpc.tag.queries.getAll.queryOptions()
      ),
      context.queryClient.ensureQueryData(
        context.trpc.collection.queries.getAll.queryOptions()
      ),
    ])
  },
  errorComponent: Error,
  notFoundComponent: () => {
    return <NotFound />
  },
  component: RouteComponent,
})

function GlobalHotkeys({ setOpen }: { setOpen: (open: boolean) => void }) {
  const navigate = useNavigate()
  const setView = useActionMenuStore((state) => state.setView)

  const actionGroups = getActionGroups({
    runCommand: (fn) => {
      setOpen(false)
      fn()
    },
    navigate: (to) => navigate(to),
    toast,
    setView: (view, composeView) => {
      setView(view, composeView)
      if (view === "compose") {
        setOpen(true)
      }
    },
  })

  const actions = actionGroups.flatMap((g) => g.items)

  const sequences = React.useMemo(
    () =>
      actions
        .filter((a) => a.shortcut?.type === "sequence")
        .map((a) => ({
          sequence: a.shortcut!.value as Hotkey[],
          callback: () => a.onSelect(),
        })),
    [actions]
  )

  useHotkeySequences(sequences)

  return (
    <React.Fragment>
      {actions
        .filter((a) => a.shortcut?.type === "chord")
        .map((action) => (
          <HotkeyHandler key={action.label} action={action} />
        ))}
    </React.Fragment>
  )
}

function HotkeyHandler({ action }: { action: any }) {
  useHotkey(action.shortcut.value as Hotkey, (e) => {
    e.preventDefault()
    action.onSelect()
  })
  return null
}

function RouteComponent() {
  const [open, setOpen] = React.useState(false)

  return (
    <SidebarProvider>
      <GlobalHotkeys setOpen={setOpen} />
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-4 px-4 justify-between">
          <SidebarTrigger />
          <ActionMenu open={open} onOpenChange={setOpen} />
          {/* <ThemeToggle /> */}
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
