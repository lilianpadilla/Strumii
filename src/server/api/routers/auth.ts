import { Role } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { createClient } from '@supabase/supabase-js'

export const authRouter = createTRPCRouter({
  getProfile: privateProcedure
    .query(async ({ input, ctx }) => {
      console.log("ctx user", { id: ctx.user?.id, email: ctx.user?.email });
      if (!ctx.user) {
        return null;
      }

      try {
        const profile = await ctx.db.profile.findUnique({
          where: {
            id: ctx.user?.id,
          },
        });
        return profile;
      } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
    }),
  deleteAccount: privateProcedure
    .input(z.object({ profileId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Authenticated user and given profileID
      if (!ctx.user || input.profileId !== ctx.user.id) {
        throw new Error("User is not authenticated");
      }

      // Have to delete in the Supabase Auth system
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
      const { data, error } = await supabase.auth.admin.deleteUser(input.profileId);

      // Handle possible error
      if (error) {
        console.log(error);
        throw new Error("Unable to delete user, Supabase error");
      }

      // Get the profile
      const account = await ctx.db.profile.findUniqueOrThrow({
        where: { id: input.profileId },
      });

      // If student, delete all course enrollments
      if (account.role === Role.STUDENT) {
        await ctx.db.courseEnrollment.deleteMany({
          where: { studentId: input.profileId },
        });
      }

      // If teacher, delete all courses and course enrollments
      else if (account.role === Role.TEACHER) {
        // Get all the courses own by the teacher
        const courses = await ctx.db.course.findMany({
          where: { teacherId: input.profileId },
        });

        // Delete all course enrollments for each course
        await Promise.all(
          courses.map(async (course) =>
            ctx.db.courseEnrollment.deleteMany({
              where: { courseId: course.id },
            })
          )
        );

        // Delete all courses
        await ctx.db.course.deleteMany({
          where: { teacherId: input.profileId },
        });
      }

      // Lastly, delete the profile
      return await ctx.db.profile.delete({
        where: { id: input.profileId },
      });
    })
});
