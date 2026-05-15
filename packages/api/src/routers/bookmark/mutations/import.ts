import prisma from "@tome/db"

import { protectedProcedure } from "../../.."
import { importBookmarksSchema } from "../schema"

interface BookmarkFolder {
  name: string
  bookmarks: {
    title: string
    url: string
    addDate: Date | null
    icon: string | null
  }[]
  subfolders: BookmarkFolder[]
}

async function saveImportedTree(
  folder: BookmarkFolder,
  userId: string,
  parentId: string | null = null,
  isRoot: boolean = false
): Promise<{ created: number; skipped: number }> {
  let created = 0
  let skipped = 0

  if (isRoot) {
    if (folder.bookmarks.length > 0) {
      const result = await prisma.bookmark.createMany({
        data: folder.bookmarks.map((b) => ({
          title: b.title,
          url: b.url,
          userId,
          collectionId: null,
        })),
        skipDuplicates: true,
      })
      created += result.count
      skipped += folder.bookmarks.length - result.count
    }

    for (const subfolder of folder.subfolders) {
      const subResult = await saveImportedTree(subfolder, userId, null, false)
      created += subResult.created
      skipped += subResult.skipped
    }
  } else {
    const collection = await prisma.collection.upsert({
      where: {
        userId_name_parentId: { 
          userId,
          name: folder.name,
          parentId: parentId ?? "",
        },
      },
      update: {},
      create: {
        name: folder.name,
        userId,
        parentId,
      },
    })

    if (folder.bookmarks.length > 0) {
      const result = await prisma.bookmark.createMany({
        data: folder.bookmarks.map((b) => ({
          title: b.title,
          url: b.url,
          userId,
          collectionId: collection.id,
        })),
        skipDuplicates: true,
      })
      created += result.count
      skipped += folder.bookmarks.length - result.count
    }

    for (const subfolder of folder.subfolders) {
      const subResult = await saveImportedTree(subfolder, userId, collection.id, false)
      created += subResult.created
      skipped += subResult.skipped
    }
  }

  return { created, skipped }
}

export const browserImport = protectedProcedure
  .input(importBookmarksSchema)
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.session.user.id
    let totalCreated = 0
    let totalSkipped = 0

    for (const folder of input.tree) {
      const result = await saveImportedTree(folder, userId, null, true)
      totalCreated += result.created
      totalSkipped += result.skipped
    }

    return { 
      success: true,
      created: totalCreated,
      skipped: totalSkipped,
    }
  })
