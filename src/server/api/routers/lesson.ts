import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

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
    .query(async ({input, ctx }) => {
      try {
        const lesson = await ctx.db.lesson.findUnique({
          where: {
            profileId: ctx.user?.id,
            id: input,
          },
        });
        return lesson;
      } catch (error) {
        console.error("Error Fetching Lesson:", error);
        return null
      }
    })
});
