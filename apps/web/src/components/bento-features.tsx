"use client"

import { LANDING_FEATURES } from "@/constants"

import * as TablerIcons from "@tome/ui/icons"
import { cn } from "@tome/ui/lib/utils"

export function BentoFeatures() {
  return (
    <section id="features" className="container mx-auto w-full scroll-mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {LANDING_FEATURES.map((feature, i) => {
          const Icon = (TablerIcons as any)[feature.icon]
          return (
            <div
              key={feature.id}
              id={feature.id}
              className={cn(
                "group relative overflow-hidden rounded-none border border-border bg-card py-18 px-12 transition-all duration-500 hover:bg-muted/50 first:border-r-0 last:border-l-0",
                i < 2 && "border-b-0",
                feature.className
              )}
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-border">
                {Icon && (
                  <Icon className="h-6 w-6 transition-colors" stroke={1.5} />
                )}
              </div>
              <h3 className="mb-2 text-lg font-medium tracking-tight">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
