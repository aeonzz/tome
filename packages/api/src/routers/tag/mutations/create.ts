import prisma from "@tome/db"

import { protectedProcedure } from "../../.."
import { createTagSchema } from "../schema"

export const create = protectedProcedure
  .input(createTagSchema)
  .mutation(async ({ input, ctx }) => {
    return await prisma.tag.create({
      data: { name: input.name, userId: ctx.session.user.id },
    })
  })
