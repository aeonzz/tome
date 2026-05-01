import { router } from "../../index"
import { collectionMutationRouter } from "./mutations"
import { collectionQueryRouter } from "./queries"

export const collectionRouter = router({
  queries: collectionQueryRouter,
  mutations: collectionMutationRouter,
})
