"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { TodoItem } from "~/components/TodoItem";
import type { Todo } from "~/types/todo";

export default function Home() {
  const [newTodo, setNewTodo] = useState("");
  const utils = api.useUtils();

  const {
    data: todos = [],
    isLoading,
    isFetching,
  } = api.todo.getAll.useQuery(undefined, {
    initialData: undefined,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const createTodo = api.todo.create.useMutation({
    onMutate: async (newTodoData) => {
      await utils.todo.getAll.cancel();
      const prevTodos = utils.todo.getAll.getData() ?? [];
      utils.todo.getAll.setData(undefined, [
        {
          id: crypto.randomUUID(),
          title: newTodoData.title,
          completed: false,
          created_at: new Date().toISOString(),
          user_id: null,
        } as Todo,
        ...prevTodos,
      ]);
      return { prevTodos };
    },
    onError: (err, newTodo, context) => {
      if (context) {
        utils.todo.getAll.setData(undefined, context.prevTodos);
      }
    },
    onSettled: () => {
      void utils.todo.getAll.invalidate();
    },
  });

  const updateTodo = api.todo.update.useMutation({
    onMutate: async (updatedTodo) => {
      await utils.todo.getAll.cancel();
      const prevTodos = utils.todo.getAll.getData() ?? [];
      utils.todo.getAll.setData(
        undefined,
        prevTodos.map((todo) =>
          todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo,
        ),
      );
      return { prevTodos };
    },
    onError: (err, newTodo, context) => {
      if (context) {
        utils.todo.getAll.setData(undefined, context.prevTodos);
      }
    },
    onSettled: () => {
      void utils.todo.getAll.invalidate();
    },
  });

  const deleteTodo = api.todo.delete.useMutation({
    onMutate: async (deletedTodo) => {
      await utils.todo.getAll.cancel();
      const prevTodos = utils.todo.getAll.getData() ?? [];
      utils.todo.getAll.setData(
        undefined,
        prevTodos.filter((todo) => todo.id !== deletedTodo.id),
      );
      return { prevTodos };
    },
    onError: (err, newTodo, context) => {
      if (context) {
        utils.todo.getAll.setData(undefined, context.prevTodos);
      }
    },
    onSettled: () => {
      void utils.todo.getAll.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    createTodo.mutate({ title: newTodo.trim() });
    setNewTodo("");
  };

  if (isLoading || (isFetching && !todos.length)) {
    return (
      <main className="min-h-screen bg-yellow-100 p-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-8 text-center text-4xl font-bold">
            ✨ Todo App ✨
          </h1>
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-yellow-100 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-4xl font-bold">✨ Todo App ✨</h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1 rounded-lg border-2 border-black bg-white p-4 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none focus:translate-x-[3px] focus:translate-y-[3px] focus:shadow-none"
            />
            <button
              type="submit"
              disabled={createTodo.isPending}
              className="rounded-lg border-2 border-black bg-green-500 px-8 py-4 font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={(id, completed) => updateTodo.mutate({ id, completed })}
              onDelete={(id) => deleteTodo.mutate({ id })}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
