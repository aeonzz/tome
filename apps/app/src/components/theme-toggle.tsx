import { Button } from "@tome/ui/components/button"
import { IconSwap, IconSwapItem } from "@tome/ui/components/icon-swap"
import { IconMoon, IconSun } from "@tome/ui/icons"

import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <IconSwap
      render={<Button variant="ghost" size="icon-sm" />}
      state={theme === "light" ? "a" : "b"}
      onClick={toggleTheme}
    >
      <IconSwapItem icon="a">
        <IconSun />
      </IconSwapItem>
      <IconSwapItem icon="b">
        <IconMoon />
      </IconSwapItem>
    </IconSwap>
  )
}
