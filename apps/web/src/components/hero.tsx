"use client"

import Link from "next/link"

import { Button } from "@tome/ui/components/button"
import { IconArrowRight, IconBookmark, IconBrandGithub } from "@tome/ui/icons"

export function Hero() {
  return (
    <section className="relative w-full border-x h-210 overflow-hidden border-border bg-background">
      <div className="container relative mx-auto flex max-w-5xl flex-col items-center justify-center gap-16 px-6 py-20 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary"></span>
            Pristine Digital Library
          </div>
          <h1 className="text-5xl font-medium tracking-tighter sm:text-6xl md:text-7xl lg:leading-[1.05]">
            Capture the web <br />
            <span className="text-muted-foreground">with one click.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Tome is a minimalist bookmark manager that lets you save any page
            instantly and keep your library organized, fast, and clutter-free —
            entirely from your browser.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center w-full pt-4">
            <Button
              size="lg"
              nativeButton={false}
              className="h-12 gap-2 rounded-full px-8 text-base"
              render={<Link href="/login" />}
            >
              Start capturing
              <IconArrowRight />
            </Button>
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              className="h-12 gap-2 rounded-full px-8 text-base"
              render={<Link href="https://github.com/aeonz-dev/tome" />}
            >
              <IconBrandGithub />
              View source
            </Button>
          </div>
        </div>
        <div className="relative flex aspect-square w-full items-center justify-center lg:aspect-auto lg:h-150">
          <div className="relative w-full overflow-hidden rounded-[2rem] border border-border bg-card">
            <div className="flex h-14 items-center gap-2 border-b border-border bg-muted/30 px-6">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-border" />
                <div className="h-3 w-3 rounded-full bg-border" />
                <div className="h-3 w-3 rounded-full bg-border" />
              </div>
              <div className="ml-4 flex h-8 w-full max-w-sm items-center rounded-md border border-border bg-background px-3 text-xs text-muted-foreground">
                <IconBookmark className="mr-2 h-3 w-3" />
                tome.app/library
              </div>
            </div>
            <div className="grid h-125 grid-cols-[200px_1fr] divide-x divide-border">
              <div className="bg-muted/10 p-4 space-y-4">
                <div className="h-6 w-24 rounded bg-border/50" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 w-full rounded bg-border/30" />
                  ))}
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-video rounded-lg border border-border bg-muted/20 p-4"
                    >
                      <div className="h-4 w-1/2 rounded bg-border/40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-10 -z-10 rounded-full bg-primary/5 blur-3xl" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20 h-32 bg-linear-to-t from-background via-background/50 to-transparent pointer-events-none" />
    </section>
  )
}
