import * as React from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PageSlideProps extends React.ComponentProps<"div"> {
  /** Which page is currently active (1-indexed) */
  page: number
  /** Override CSS custom properties for this instance */
  vars?: {
    slideDur?: string
    fadeDur?: string
    slideDistance?: string
    blur?: string
    stagger?: string
    exitEnabled?: 0 | 1
  }
}

export interface PageSlidePageProps extends Omit<React.ComponentProps<"section">, "id"> {
  /** Must match the index used in PageSlide's `page` prop (1-indexed) */
  id: number
}

// ─── Sub-component: Page ─────────────────────────────────────────────────────

function Page({ id, className, style, children, ...props }: PageSlidePageProps) {
  return (
    <section
      className={["t-page", className].filter(Boolean).join(" ")}
      data-page-id={id}
      style={style}
      {...props}
    >
      {children}
    </section>
  )
}

Page.displayName = "PageSlide.Page"

// ─── Root component ───────────────────────────────────────────────────────────

function PageSlide({
  page,
  vars,
  className,
  style,
  children,
  ...props
}: PageSlideProps) {
  const cssVars = vars
    ? ({
        "--page-slide-dur": vars.slideDur,
        "--page-fade-dur": vars.fadeDur,
        "--page-slide-distance": vars.slideDistance,
        "--page-blur": vars.blur,
        "--page-stagger": vars.stagger,
        "--page-exit-enabled": vars.exitEnabled,
      } as React.CSSProperties)
    : undefined

  return (
    <div
      className={["t-page-slide", className].filter(Boolean).join(" ")}
      data-page={page}
      style={{ ...cssVars, ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

PageSlide.displayName = "PageSlide"
PageSlide.Page = Page

// ─── Exports ──────────────────────────────────────────────────────────────────

export { PageSlide }
