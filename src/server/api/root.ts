import { createTRPCRouter } from "./trpc";
import { itemRouter } from "./routers/items";
import { listRouter } from "./routers/lists";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  items: itemRouter,
  lists: listRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
