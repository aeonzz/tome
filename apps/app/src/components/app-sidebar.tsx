import * as React from "react"
import { Route } from "@/routes/_app/route"
import { Link, useLocation } from "@tanstack/react-router"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@tome/ui/components/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@tome/ui/components/sidebar"
import { IconChevronRight } from "@tome/ui/icons"

import { SIDEBAR_ITEMS } from "@/config/constants"
import { actionRegistry } from "@/lib/action-registry"
import { useActionMenuStore } from "@/hooks/use-action-menu"
import { HotkeyBadge } from "@/components/hotkey-badge"
import { NavUser } from "@/components/nav-user"
import { useTheme } from "@/components/theme-provider"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar()
  const { setTheme } = useTheme()
  const location = useLocation()
  const { session } = Route.useRouteContext()
  const closeMenu = useActionMenuStore((state) => state.closeMenu)

  React.useMemo(() => {
    actionRegistry.register("nav.sidebar", toggleSidebar)
    actionRegistry.register("theme.light", () => {
      closeMenu()
      setTimeout(() => setTheme("light"), 450)
    })
    actionRegistry.register("theme.dark", () => {
      closeMenu()
      setTimeout(() => setTheme("dark"), 450)
    })
    actionRegistry.register("theme.system", () => {
      closeMenu()
      setTimeout(() => setTheme("system"), 450)
    })
  }, [toggleSidebar, setTheme, closeMenu])

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={session.user} />
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(SIDEBAR_ITEMS).map(([sectionName, items]) => (
          <SidebarGroup key={sectionName}>
            <SidebarGroupLabel className="capitalize">
              {sectionName}
            </SidebarGroupLabel>
            <SidebarMenu>
              {items.map((item) => (
                <Collapsible key={item.title} render={<SidebarMenuItem />}>
                  {item.items?.length ? (
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuButton
                          isActive={!!item.url && item.url === location.pathname}
                          className="cursor-pointer data-panel-open:[&>svg:last-child]:rotate-90 active:bg-sidebar-accent/50"
                        />
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                      <IconChevronRight className=" transition-transform duration-300 ease-out-expo will-change-transform" />
                    </CollapsibleTrigger>
                  ) : (
                    <SidebarMenuButton
                      tooltip={{
                        title: item.title,
                        shortcut: item.shortcut ? (
                          <HotkeyBadge shortcut={item.shortcut} />
                        ) : undefined,
                      }}
                      isActive={item.url === location.pathname}
                      render={<Link to={item.url!} />}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              render={<Link to={subItem.url} />}
                            >
                              <subItem.icon />
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
