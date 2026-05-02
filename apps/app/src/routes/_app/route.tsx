import * as React from "react"
import { getUser } from "@/functions/get-user"
import {
  useHotkey,
  useHotkeySequences,
  type Hotkey,
} from "@tanstack/react-hotkeys"
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@tome/ui/components/sidebar"

import {
  ACTION_DEFINITIONS,
  actionRegistry,
  type ActionDefinition,
} from "@/lib/action-registry"
import { useActionMenuStore, type ComposeView } from "@/hooks/use-action-menu"
import { ActionMenu, NAV_ROUTES } from "@/components/action-menu"
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

function GlobalHotkeys() {
  const navigate = useNavigate()
  const { open, openTo } = useActionMenuStore()

  // Don't fire shortcuts when the menu is open — user is typing
  const enabled = !open

  const sequences = React.useMemo(
    () =>
      ACTION_DEFINITIONS.filter((def) => def.shortcut?.type === "sequence").map(
        (def) => ({
          sequence: def.shortcut!.value as Hotkey[],
          callback: () => {
            if (!enabled) return
            handleShortcut(def)
          },
        })
      ),
    [enabled]
  )

  useHotkeySequences(sequences)

  function handleShortcut(def: ActionDefinition) {
    if (def.opensView) {
      const [type, subView] = def.opensView.split(".")
      openTo({ type: "compose", view: subView as ComposeView })
      return
    }
    if (def.id.startsWith("nav.")) {
      navigate({ to: NAV_ROUTES[def.id] })
      return
    }
    actionRegistry.execute(def.id)
  }

  return (
    <>
      {ACTION_DEFINITIONS.filter((def) => def.shortcut?.type === "chord").map(
        (def) => (
          <HotkeyHandler
            key={def.id}
            hotkey={def.shortcut!.value as Hotkey}
            enabled={enabled}
            onTrigger={() => handleShortcut(def)}
          />
        )
      )}
    </>
  )
}

function HotkeyHandler({
  hotkey,
  enabled,
  onTrigger,
}: {
  hotkey: Hotkey
  enabled: boolean
  onTrigger: () => void
}) {
  useHotkey(hotkey, (e) => {
    if (!enabled) return
    e.preventDefault()
    onTrigger()
  })
  return null
}

function RouteComponent() {
  return (
    <SidebarProvider>
      <GlobalHotkeys />
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-4 px-4 justify-between">
          <SidebarTrigger />
          <ActionMenu />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
