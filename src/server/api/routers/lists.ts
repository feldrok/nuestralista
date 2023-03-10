import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "./../trpc";

import { z } from "zod";

export const listRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.list.findMany({
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }),
  addList: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const item = ctx.prisma.list.create({
          data: {
            name: input.name,
            userId: ctx.session.user.id,
          },
        });
        return item;
      } catch (error) {
        console.log(error);
      }
    }),
});
