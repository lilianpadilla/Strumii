import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { createClient } from '@supabase/supabase-js'

export const lessonRouter = createTRPCRouter({
  getLesson: privateProcedure
    .query(async ({ input, ctx }) => {
      try {
        const lesson = await ctx.db.lesson.findUnique({
          where: {
            id: ctx.user?.id,
          },
        });
        return lesson;
      } catch (error) {
        console.error("Error fetching lesson:", error);
        return null;
      }
    }),
});
