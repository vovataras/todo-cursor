import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { supabase } from "~/lib/supabase";
import type { Todo } from "~/types/todo";

export const todoRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<Todo[]>();

    if (error) throw error;
    return data ?? [];
  }),

  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from("todos")
        .insert([{ title: input.title, completed: false }])
        .select()
        .single()
        .returns<Todo>();

      if (error) throw error;
      return data;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        completed: z.boolean().optional(),
        title: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from("todos")
        .update({
          ...(input.completed !== undefined && { completed: input.completed }),
          ...(input.title !== undefined && { title: input.title }),
        })
        .eq("id", input.id)
        .select()
        .single()
        .returns<Todo>();

      if (error) throw error;
      return data;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", input.id);

      if (error) throw error;
      return { success: true } as const;
    }),
});
