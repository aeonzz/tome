import z from "zod"

export const importBookmarksSchema = z.object({
  tree: z.array(z.any()),
})
