import { router } from "../../index"
import { tagMutationRouter } from "./mutations"
import { tagQueryRouter } from "./queries"

export const tagRouter = router({
  queries: tagQueryRouter,
  mutations: tagMutationRouter,
})
