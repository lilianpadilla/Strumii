
import { z } from "zod";
import { createTRPCRouter, privateProcedure} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getProfile: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.profile.findUnique({
      where: { id: ctx.user?.id },
    });
  }),

  getUserPreferences: privateProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    return await ctx.db.userPreferences.findUnique({
      where: { id: input.id },
    });
  }),

  updateUserPreferences: privateProcedure
  .input(
    z.object({
      id: z.string(),
      preferredGenres: z.array(z.string()).optional(),
      skillLevel: z.string().optional(),
      lessonLength: z.number().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { ...fieldsToUpdate } = input;

    // Filter out undefined fields (only update provided ones)
    const data = Object.fromEntries(
      Object.entries(fieldsToUpdate).filter(([_, v]) => v !== undefined)
    );

    // Update only provided fields
    return await ctx.db.userPreferences.update({
      where: { id: input.id },
      data,
    });
  }),

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
  })
})