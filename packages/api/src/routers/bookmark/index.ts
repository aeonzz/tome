import { router } from "../../index"
import { bookmarkMutationRouter } from "./mutations"

export const bookmarkRouter = router({
  mutations: bookmarkMutationRouter,
})
