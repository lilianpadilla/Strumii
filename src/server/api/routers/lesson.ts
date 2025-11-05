import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from 'zod';

export const lessonRouter = createTRPCRouter({
  getLessons: privateProcedure
    .query(async ({ ctx }) => {
      try {
        const lessons = await ctx.db.lesson.findMany({
          where: {
            profileId: ctx.user?.id,
          },
        });
        return lessons;
      } catch (error) {
        console.error("Error fetching lessons:", error);
        return null;
      }
    }),
  getLesson: privateProcedure
    .input(z.string())
    .query(async ({input: lessonId, ctx }) => {
      try {
        const lesson = await ctx.db.lesson.findUnique({
          where: {
            profileId: ctx.user?.id,
            id: lessonId,
          },
        });
        return lesson;
      } catch (error) {
        console.error("Error Fetching Lesson:", error);
        return null
      }
    })
});
