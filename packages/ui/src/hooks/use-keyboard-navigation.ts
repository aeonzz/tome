import * as React from "react"

interface UseKeyboardNavigationProps<T> {
  items: T[]
  onSelect?: (item: T) => void
  loop?: boolean
  enableGlobalArrows?: boolean
}

export function useKeyboardNavigation<T>({
  items,
  onSelect,
  loop = true,
  enableGlobalArrows = false,
}: UseKeyboardNavigationProps<T>) {
  const [activeIndex, setActiveIndex] = React.useState<number>(-1)
  const [isKeyboardActive, setIsKeyboardActive] = React.useState(false)
  const itemRefs = React.useRef<Map<number, HTMLElement>>(new Map())
  const shouldSyncFocus = React.useRef(false)

  // Reset active index when items change
  React.useEffect(() => {
    setActiveIndex(-1)
    setIsKeyboardActive(false)
  }, [items])

  // Focus the active item when it changes, ONLY if interaction was keyboard-driven
  React.useEffect(() => {
    if (activeIndex !== -1 && shouldSyncFocus.current) {
      itemRefs.current.get(activeIndex)?.focus()
    }
  }, [activeIndex])

  // Global listener for initial focus when not interacting with the list
  React.useEffect(() => {
    if (!enableGlobalArrows || items.length === 0 || activeIndex !== -1) return

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const activeElement = document.activeElement as HTMLElement
      if (
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.isContentEditable
      ) {
        return
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault()
        shouldSyncFocus.current = true
        setIsKeyboardActive(true)
        setActiveIndex(0)
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [activeIndex, items.length, enableGlobalArrows])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (items.length === 0) return

    shouldSyncFocus.current = true
    setIsKeyboardActive(true)

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault()
        setActiveIndex((prev) => {
          if (prev < items.length - 1) return prev + 1
          return loop ? 0 : prev
        })
        break
      }
      case "ArrowUp": {
        e.preventDefault()
        setActiveIndex((prev) => {
          if (prev > 0) return prev - 1
          return loop ? items.length - 1 : prev
        })
        break
      }
      case "Home": {
        e.preventDefault()
        setActiveIndex(0)
        break
      }
      case "End": {
        e.preventDefault()
        setActiveIndex(items.length - 1)
        break
      }
      case "Enter": {
        const item = items[activeIndex]
        if (item !== undefined) {
          e.preventDefault()
          onSelect?.(item)
        }
        break
      }
      case "Tab": {
        // Tab navigates items but allows exiting the list at boundaries to avoid focus trap
        if (e.shiftKey) {
          // Shift+Tab: Go up
          if (activeIndex > 0) {
            e.preventDefault()
            setActiveIndex((prev) => prev - 1)
          }
          // If at 0 or -1, allow default behavior to move focus out (previous element)
        } else {
          // Tab: Go down
          if (activeIndex < items.length - 1) {
            e.preventDefault()
            setActiveIndex((prev) => prev + 1)
          }
          // If at last item, allow default behavior to move focus out (next element)
        }
        break
      }
    }
  }

  const getItemProps = (index: number) => ({
    onMouseEnter: (e: React.MouseEvent) => {
      shouldSyncFocus.current = true
      setIsKeyboardActive(false)
      setActiveIndex(index)
      // Native focus without immediate ring (controlled by data-kb-visible)
      ;(e.currentTarget as HTMLElement).focus({ preventScroll: true })
    },
    onMouseLeave: (e: React.MouseEvent) => {
      setActiveIndex(-1)
      ;(e.currentTarget as HTMLElement).blur()
    },
    // Handler for when the item receives focus natively (click or tab)
    onFocus: () => {
      shouldSyncFocus.current = true
      setActiveIndex(index)
    },
    "data-active": index === activeIndex || undefined,
    "data-kb-visible": (index === activeIndex && isKeyboardActive) || undefined,
    ref: (node: HTMLElement | null) => {
      if (node) itemRefs.current.set(index, node)
      else itemRefs.current.delete(index)
    },
    tabIndex:
      index === activeIndex || (activeIndex === -1 && index === 0) ? 0 : -1,
    onKeyDown: (e: React.KeyboardEvent) => {
      setIsKeyboardActive(true)
      handleKeyDown(e)
    },
  })

  const getContainerProps = () => ({
    // Container no longer manages focus or keys directly
    role: "listbox",
    onBlur: (e: React.FocusEvent) => {
      // Check if focus is moving outside the container
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setActiveIndex(-1)
      }
    },
  })

  return {
    activeIndex,
    setActiveIndex,
    getItemProps,
    getContainerProps,
  }
}
