"use client"

import Image from "next/image"
import Link from "next/link"
import { LANDING_NAV_LINKS } from "@/constants"

import { Button } from "@tome/ui/components/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@tome/ui/components/navigation-menu"

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50 bg-background border-b border-border">
      <div className="relative flex flex-row items-center justify-between px-5 h-14 py-1 max-w-7xl mx-auto border-x border-border">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-medium mr-4">
            <Image
              src="/icons/logo-ic-black.svg"
              alt="Logo"
              width={24}
              height={24}
            />
            <span>Tome</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList className="hidden md:flex gap-1">
              {LANDING_NAV_LINKS.map((navItem, index) => {
                if ("items" in navItem) {
                  return (
                    <NavigationMenuItem key={navItem.label || index}>
                      <NavigationMenuTrigger>
                        {navItem.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="flex w-170 rounded-[calc(var(--radius)+2px)] border border-border/50 bg-popover overflow-hidden">
                          <div className="flex-1 space-y-2 p-2 py-4 border-r border-border/50 bg-muted/20">
                            <h4 className="text-xs font-medium text-muted-foreground mx-2">
                              {navItem.items[0].title}
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {navItem.items[0].links.map((link, i) => (
                                <Link
                                  key={i}
                                  href={link.href as any}
                                  className="flex flex-col gap-1 rounded-md p-2 hover:bg-muted transition-all border border-transparent hover:border-border/50"
                                >
                                  <span className="text-sm font-medium leading-none">
                                    {link.label}
                                  </span>
                                  <span className="text-xs text-muted-foreground line-clamp-1">
                                    {link.description}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                          <div className="w-50 space-y-2 p-2 py-4 bg-muted/5">
                            <h4 className="text-xs font-medium text-muted-foreground">
                              {navItem.items[1].title}
                            </h4>
                            <div className="flex flex-col gap-1">
                              {navItem.items[1].links.map((link, i) => (
                                <Link
                                  key={i}
                                  href={link.href as any}
                                  className="flex flex-col gap-1 rounded-md p-2 hover:bg-muted transition-all border border-transparent hover:border-border/50"
                                >
                                  <span className="text-sm font-medium leading-none">
                                    {link.label}
                                  </span>
                                  <span className="text-xs text-muted-foreground line-clamp-2">
                                    {link.description}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )
                }

                const item = navItem as { to: string; label: string }
                return (
                  <NavigationMenuItem key={item.to || index}>
                    <NavigationMenuLink
                      render={<Link href={item.to as any} />}
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="/login" />}
            className="rounded-full text-sm"
          >
            Sign in
          </Button>
          <Button
            variant="default"
            size="lg"
            nativeButton={false}
            render={<Link href="/login" />}
            className="rounded-full text-sm"
          >
            Get started
          </Button>
        </div>
      </div>
    </header>
  )
}
