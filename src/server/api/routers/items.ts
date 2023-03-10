import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "./../trpc";

import { z } from "zod";

export const itemRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ listId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.item.findMany({
          select: {
            id: true,
            name: true,
            checked: true,
          },
          where: {
            listId: input.listId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  addItem: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const item = ctx.prisma.item.create({
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
  updateItem: protectedProcedure
    .input(z.object({ id: z.string(), checked: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const item = await ctx.prisma.item.update({
          where: {
            id: input.id,
          },
          data: {
            checked: input.checked,
          },
        });
        return item;
      } catch (error) {
        console.log(error);
      }
    }),
  deleteItem: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const item = await ctx.prisma.item.delete({
          where: {
            id: input.id,
          },
        });
        return item;
      } catch (error) {
        console.log(error);
      }
    }),
});
