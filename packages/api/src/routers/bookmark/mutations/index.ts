import { router } from "../../../index"
import { browserImport } from "./import"

export const bookmarkMutationRouter = router({
  import: {
    browserImport,
  },
})
