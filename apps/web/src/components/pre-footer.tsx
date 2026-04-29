"use client"

import Link from "next/link"
import { Button } from "@tome/ui/components/button"

export function PreFooter() {
  return (
    <section className="relative w-full flex-1 flex items-center border-x border-border bg-background px-5 overflow-hidden py-32">
      <div className="relative py-24 bg-foreground rounded-3xl h-fit w-full">
        <div className="container relative mx-auto flex max-w-5xl flex-col items-center justify-center gap-10 px-6 text-center">
          <h2 className="text-3xl text-background font-medium tracking-tighter sm:text-4xl md:text-5xl lg:leading-[1.1]">
            Ready to simplify your <br />
            <span className="text-background/60">digital library?</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Button
              size="lg"
              variant="secondary"
              nativeButton={false}
              className="h-12 gap-2 rounded-full px-8 text-base w-full sm:w-auto font-semibold"
              render={<Link href="/login" />}
            >
              Start capturing
            </Button>
          </div>
          <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 -z-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
