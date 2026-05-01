import prisma from "@tome/db"

import { protectedProcedure } from "../../.."

export const getAll = protectedProcedure.query(async ({ ctx }) => {
  return await prisma.tag.findMany({
    where: { userId: ctx.session.user.id },
    orderBy: { name: "asc" },
  })
})
