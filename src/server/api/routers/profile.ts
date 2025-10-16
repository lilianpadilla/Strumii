
import { z } from "zod";
import { createTRPCRouter, privateProcedure} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  updateProfile: privateProcedure
  .input(
    z.object({
      name: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { ...fieldsToUpdate } = input;

    // Filter out undefined fields (only update provided ones)
    const data = Object.fromEntries(
      Object.entries(fieldsToUpdate).filter(([_, v]) => v !== undefined)
    );

    // Update only provided fields
    return await ctx.db.profile.update({
      where: { id: ctx.user?.id },
      data,
    });
  }),
})