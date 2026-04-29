import type { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query"
import type { AppRouter } from "@tome/api/routers/index"

import { getThemeServerFn } from "@/lib/theme"
import { Providers } from "@/components/providers"

import appCss from "../index.css?url"

export interface RouterAppContext {
  trpc: TRPCOptionsProxy<AppRouter>
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  loader: () => getThemeServerFn(),
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Tome",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon/favicon.ico",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon/favicon-16x16.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/favicon/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/favicon/site.webmanifest",
      },
    ],
  }),

  component: RootDocument,
})

function RootDocument() {
  const theme = Route.useLoaderData()
  return (
    <html className={theme} lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers theme={theme}>
          <div className="grid h-svh grid-rows-[auto_1fr]">
            <Outlet />
          </div>
        </Providers>
        <Scripts />
      </body>
    </html>
  )
}
