import { createContext, use, useState, useEffect, type PropsWithChildren } from "react"
import { useRouter } from "@tanstack/react-router"

import { setThemeServerFn, type T as Theme } from "@/lib/theme"

type ThemeContextVal = { theme: Theme; setTheme: (val: Theme) => void }
type Props = PropsWithChildren<{ theme: Theme }>

const ThemeContext = createContext<ThemeContextVal | null>(null)

export function ThemeProvider({ children, theme: initialTheme }: Props) {
  const router = useRouter()
  const [optimisticTheme, setOptimisticTheme] = useState<Theme>(initialTheme)

  // Sync with server-side theme if it changes externally
  useEffect(() => {
    setOptimisticTheme(initialTheme)
  }, [initialTheme])

  function setTheme(val: Theme) {
    setOptimisticTheme(val)

    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(val)

    setThemeServerFn({ data: val }).then(() => {
      // Invalidate to ensure all components see the fresh state from the loader
      router.invalidate()
    })
  }

  return (
    <ThemeContext value={{ theme: optimisticTheme, setTheme }}>
      {children}
    </ThemeContext>
  )
}

export function useTheme() {
  const val = use(ThemeContext)
  if (!val) throw new Error("useTheme called outside of ThemeProvider!")
  return val
}
