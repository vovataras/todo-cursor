import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { todos } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";

export const todoRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    return db.select().from(todos).orderBy(desc(todos.createdAt));
  }),

  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const result = await db
        .insert(todos)
        .values({
          title: input.title,
          completed: false,
        })
        .returning();
      return result[0];
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        completed: z.boolean().optional(),
        title: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await db
        .update(todos)
        .set({
          ...(input.completed !== undefined && { completed: input.completed }),
          ...(input.title !== undefined && { title: input.title }),
        })
        .where(eq(todos.id, input.id))
        .returning();
      return result[0];
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(todos).where(eq(todos.id, input.id));
      return { success: true } as const;
    }),
});
