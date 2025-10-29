import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { createClient } from '@supabase/supabase-js'

export const lessonRouter = createTRPCRouter({
  getLesson: privateProcedure
    .query(async ({ input, ctx }) => {
      try {
        const lessons = await ctx.db.lesson.findMany({
          where: {
            id: ctx.user?.id,
          },
        });
        return lessons;
      } catch (error) {
        console.error("Error fetching lesson:", error);
        return null;
      }
    }),
});
