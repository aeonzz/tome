import * as React from "react"
import { cn } from "@tome/ui/lib/utils"

const __TRANSITION_STYLES = `
:root {
  --page-slide-dur: 300ms;
  --page-fade-dur: 300ms;
  --page-slide-distance: 12px;
  --page-blur: 4px;
  --page-stagger: 0ms;
  --page-exit-enabled: 1;
  --page-slide-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --page-fade-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.t-page-slide {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
.t-page-slide .t-page[data-page-id="root"] {
  --t-page-from-x: calc(var(--page-slide-distance) * -1);
}
.t-page-slide .t-page[data-page-id="compose"] {
  --t-page-from-x: var(--page-slide-distance);
}
.t-page-slide .t-page {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  transform: translateX(calc(var(--t-page-from-x, 0px) * var(--page-exit-enabled)));
  filter: blur(calc(var(--page-blur) * var(--page-exit-enabled)));
  transition:
    opacity   var(--page-fade-dur)  var(--page-fade-ease),
    transform var(--page-slide-dur) var(--page-slide-ease),
    filter    var(--page-slide-dur) var(--page-slide-ease);
  will-change: opacity, transform, filter;
}
.t-page-slide[data-page="root"] .t-page[data-page-id="root"],
.t-page-slide[data-page="compose"] .t-page[data-page-id="compose"] {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(0);
  filter: blur(0);
  transition-delay: var(--page-stagger);
}

@media (prefers-reduced-motion: reduce) {
  .t-page-slide .t-page { transition: none !important; }
}
`

if (typeof document !== "undefined" && !document.getElementById("transitions-p8")) {
  const __style = document.createElement("style")
  __style.id = "transitions-p8"
  __style.textContent = __TRANSITION_STYLES
  document.head.appendChild(__style)
}

interface PageSlideProps {
  activePage: "root" | "compose"
  children: React.ReactNode
  className?: string
}

export function PageSlide({ activePage, children, className }: PageSlideProps) {
  return (
    <div className={cn("t-page-slide", className)} data-page={activePage}>
      {children}
    </div>
  )
}

interface PageProps {
  id: "root" | "compose"
  children: React.ReactNode
  className?: string
}

export function Page({ id, children, className }: PageProps) {
  return (
    <section className={cn("t-page", className)} data-page-id={id}>
      {children}
    </section>
  )
}
