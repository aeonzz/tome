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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@tome/ui/components/input-group"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@tome/ui/components/sidebar"
import { IconSearch } from "@tome/ui/icons"

import { NAV_ROUTES } from "@/config/constants"
import {
  ACTION_DEFINITIONS,
  actionRegistry,
} from "@/lib/action-registry"
import { useActionMenuStore, type ComposeView } from "@/hooks/use-action-menu"
import { ActionMenu } from "@/components/action-menu"
import { AppSidebar } from "@/components/app-sidebar"
import { Error } from "@/components/error"
import { HotkeyBadge } from "@/components/hotkey-badge"
import { NotFound } from "@/components/not-found"
import type { ActionDefinition } from "@/types/action-types"

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
  const { open, openTo, openMenu, closeMenu } = useActionMenuStore()
  const { toggleSidebar } = useSidebar()
  const enabled = !open

  React.useMemo(() => {
    actionRegistry.register("nav.sidebar", toggleSidebar)
  }, [toggleSidebar])

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

  useHotkey("Mod+K", (e) => {
    e.preventDefault()
    open ? closeMenu() : openMenu()
  })

  function handleShortcut(def: ActionDefinition) {
    if (def.opensView) {
      const [type, subView] = def.opensView.split(".")
      openTo({ type: "compose", view: subView as ComposeView })
      return
    }
    if (def.id.startsWith("nav.")) {
      const route = NAV_ROUTES[def.id]
      if (route) {
        navigate({ to: route })
        return
      }
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
  const openMenu = useActionMenuStore((state) => state.openMenu)

  return (
    <SidebarProvider>
      <GlobalHotkeys />
      <AppSidebar />
      <SidebarInset>
        <header className="flex shrink-0 items-center gap-4 p-2 justify-between border-b">
          <SidebarTrigger />
          <InputGroup
            className="w-full max-w-xs cursor-pointer select-none"
            onClick={openMenu}
          >
            <InputGroupAddon>
              <IconSearch className="size-4 opacity-50" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search or run a command..."
              readOnly
              className="cursor-pointer"
            />
            <InputGroupAddon align="inline-end">
              <HotkeyBadge shortcut={{ type: "chord", value: "Mod+K" }} />
            </InputGroupAddon>
          </InputGroup>
        </header>
        <Outlet />
      </SidebarInset>
      <ActionMenu />
    </SidebarProvider>
  )
}
