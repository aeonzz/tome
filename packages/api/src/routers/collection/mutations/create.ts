import prisma from "@tome/db"

import { protectedProcedure } from "../../.."
import { createCollectionSchema } from "../schema"

export const create = protectedProcedure
  .input(createCollectionSchema)
  .mutation(async ({ input, ctx }) => {
    return await prisma.collection.create({
      data: {
        ...input,
        userId: ctx.session.user.id,
      },
    })
  })
