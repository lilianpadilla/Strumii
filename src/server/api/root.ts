import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { profileRouter } from "./routers/profile";
import { lessonRouter } from "./routers/lesson";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  profile: profileRouter,
  lesson: lessonRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
