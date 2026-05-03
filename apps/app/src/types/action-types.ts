import type { Hotkey } from "@tanstack/react-hotkeys"

import type { IconProps } from "@tome/ui/icons"

export type IconComponent = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>

export type Shortcut =
  | { type: "chord"; value: Hotkey }
  | { type: "sequence"; value: [Hotkey, Hotkey] }

export type SelectionContext = "bookmark" | "collection" | "tag"

export type ActionGroup =
  | "navigation"
  | "bookmark"
  | "collection"
  | "tag"
  | "general"

export type PageContext =
  | "bookmarks"
  | "collections"
  | "tags"
  | "archive"
  | "star"

/**
 * An ActionDefinition is pure, static data.
 * It describes an action but knows nothing about how to execute it.
 * Handlers are registered separately via ActionRegistry.
 */
export type ActionDefinition = {
  /** Stable unique identifier — used to register handlers */
  id: string
  label: string
  icon: IconComponent
  group: ActionGroup
  shortcut?: Shortcut
  /**
   * If set, this action is hidden from the command menu unless
   * the specified entity is currently selected.
   */
  requiresSelection?: SelectionContext
  /**
   * If set, this action opens a sub-view inside the command menu
   * instead of running a handler.
   */
  opensView?: string
  /** If set, selecting this item opens a nested list instead of executing */
  children?: ActionDefinition[]
  /** Context of the page where the action is available */
  context?: PageContext
}
