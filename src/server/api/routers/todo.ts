import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { todos } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";
import type { Todo } from "~/types/todo";

export const todoRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const result = await db
      .select()
      .from(todos)
      .orderBy(desc(todos.created_at));
    return result.map((todo) => ({
      ...todo,
      created_at: todo.created_at.toISOString(),
    })) satisfies Todo[];
  }),

  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [result] = await db
        .insert(todos)
        .values({
          title: input.title,
          completed: false,
        })
        .returning();
      if (!result) throw new Error("Failed to create todo");
      return {
        ...result,
        created_at: result.created_at.toISOString(),
      } satisfies Todo;
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
      const [result] = await db
        .update(todos)
        .set({
          ...(input.completed !== undefined && { completed: input.completed }),
          ...(input.title !== undefined && { title: input.title }),
        })
        .where(eq(todos.id, input.id))
        .returning();
      if (!result) throw new Error("Todo not found");
      return {
        ...result,
        created_at: result.created_at.toISOString(),
      } satisfies Todo;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(todos).where(eq(todos.id, input.id));
      return { success: true } as const;
    }),
});
