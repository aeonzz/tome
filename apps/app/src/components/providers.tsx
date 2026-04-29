import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import { Toaster } from "@tome/ui/components/sonner"
import { TooltipProvider } from "@tome/ui/components/tooltip"

import { type T as Theme } from "@/lib/theme"

import { ThemeProvider } from "./theme-provider"

export function Providers({
  theme,
  children,
}: {
  theme: Theme
  children: React.ReactNode
}) {
  return (
    <ThemeProvider theme={theme}>
      <TooltipProvider>
        {children}
        <Toaster richColors />
        <TanStackRouterDevtools position="bottom-left" />
        <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
      </TooltipProvider>
    </ThemeProvider>
  )
}
