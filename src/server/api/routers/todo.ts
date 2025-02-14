import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { todos } from "~/server/db/schema";
import { desc, eq, and } from "drizzle-orm";
import type { Todo } from "~/types/todo";

export const todoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const result = await db
      .select()
      .from(todos)
      .where(eq(todos.user_id, ctx.session.user.id))
      .orderBy(desc(todos.created_at));

    return result.map((todo) => ({
      ...todo,
      created_at: todo.created_at.toISOString(),
    })) satisfies Todo[];
  }),

  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await db
        .insert(todos)
        .values({
          title: input.title,
          completed: false,
          user_id: ctx.session.user.id,
        })
        .returning();

      if (!result) throw new Error("Failed to create todo");
      return {
        ...result,
        created_at: result.created_at.toISOString(),
      } satisfies Todo;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        completed: z.boolean().optional(),
        title: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await db
        .update(todos)
        .set({
          ...(input.completed !== undefined && { completed: input.completed }),
          ...(input.title !== undefined && { title: input.title }),
        })
        .where(
          and(eq(todos.id, input.id), eq(todos.user_id, ctx.session.user.id)),
        )
        .returning();

      if (!result) throw new Error("Todo not found");
      return {
        ...result,
        created_at: result.created_at.toISOString(),
      } satisfies Todo;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(todos)
        .where(
          and(eq(todos.id, input.id), eq(todos.user_id, ctx.session.user.id)),
        );
      return { success: true } as const;
    }),
});
