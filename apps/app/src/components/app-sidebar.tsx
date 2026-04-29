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
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@tome/ui/components/sidebar"
import { IconChevronRight } from "@tome/ui/icons"

import { SIDEBAR_ITEMS } from "@/config/constants"
import { NavUser } from "@/components/nav-user"
import { useTheme } from "@/components/theme-provider"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const { session } = Route.useRouteContext()
  const { theme } = useTheme()

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent active:bg-transparent px-0"
            >
              <div className="flex aspect-square size-8 items-center justify-center">
                <img
                  src={
                    theme === "light"
                      ? "/icons/logo-ic-black.svg"
                      : "/icons/logo-ic-white.svg"
                  }
                  alt="Tome Logo"
                  width={20}
                  height={20}
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold -ml-1.5">Tome</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.url === location.pathname}
                    render={<Link to={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <>
                      <CollapsibleTrigger
                        render={
                          <SidebarMenuAction className="aria-expanded:rotate-90" />
                        }
                      >
                        <IconChevronRight />
                        <span className="sr-only">Toggle</span>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                render={<a href={subItem.url} />}
                              >
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
