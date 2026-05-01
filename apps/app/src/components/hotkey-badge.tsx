import * as React from "react"
import { formatForDisplay, parseHotkey, type Hotkey } from "@tanstack/react-hotkeys"

import { Kbd } from "@tome/ui/components/kbd"
import type { Shortcut } from "@/config/constants"

export function HotkeyBadge({ shortcut }: { shortcut: Shortcut }) {
  const hotkeys = shortcut.type === "sequence" ? shortcut.value : [shortcut.value]

  return (
    <span className="flex items-center gap-1">
      {hotkeys.map((hk, i) => (
        <div key={i} className="flex items-center gap-0.5">
          <HotkeyParts hotkey={hk} />
        </div>
      ))}
    </span>
  )
}

function HotkeyParts({ hotkey }: { hotkey: Hotkey }) {
  const parsed = parseHotkey(hotkey)

  const parts = [
    parsed.ctrl && formatForDisplay("Control"),
    parsed.meta && formatForDisplay("Meta"),
    parsed.shift && formatForDisplay("Shift"),
    parsed.alt && formatForDisplay("Alt"),
    formatForDisplay(parsed.key),
  ].filter(Boolean) as string[]

  return (
    <React.Fragment>
      {parts.map((part, i) => (
        <Kbd
          key={i}
          data-icon="inline-end"
          className="translate-x-0.5 px-1.5 py-0.5 text-[10px]"
        >
          {part}
        </Kbd>
      ))}
    </React.Fragment>
  )
}
