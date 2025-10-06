
import { z } from "zod";
import { createTRPCRouter, privateProcedure} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  updateProfile: privateProcedure
  .input(
    z.object({
      profileId: z.string(),
      name: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { profileId, ...fieldsToUpdate } = input;

    // Filter out undefined fields (only update provided ones)
    const data = Object.fromEntries(
      Object.entries(fieldsToUpdate).filter(([_, v]) => v !== undefined)
    );

    // Update only provided fields
    return await ctx.db.profile.update({
      where: { id: profileId },
      data,
    });
  }),
})