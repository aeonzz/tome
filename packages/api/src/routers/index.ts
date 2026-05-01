import { protectedProcedure, publicProcedure, router } from "../index"
import { collectionRouter } from "./collection"
import { tagRouter } from "./tag"
import { todoRouter } from "./todo"

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK"
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    }
  }),
  todo: todoRouter,
  tag: tagRouter,
  collection: collectionRouter,
})
export type AppRouter = typeof appRouter
