import type { Omit } from "."
import type {
  Collection as CollectionType,
  Tag as TagType,
} from "../../../../packages/db/prisma/generated/client"

export type Tag = Omit<TagType, "createdAt"> & {
  createdAt: string
}

export type Collection = Omit<CollectionType, "createdAt"> & {
  createdAt: string
}
