"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { TodoItem } from "~/components/TodoItem";

export default function Home() {
  const [newTodo, setNewTodo] = useState("");
  const utils = api.useUtils();

  const todos = api.todo.getAll.useQuery();
  const createTodo = api.todo.create.useMutation({
    onSuccess: () => {
      setNewTodo("");
      void utils.todo.getAll.invalidate();
    },
  });
  const updateTodo = api.todo.update.useMutation({
    onSuccess: () => {
      void utils.todo.getAll.invalidate();
    },
  });
  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: () => {
      void utils.todo.getAll.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    createTodo.mutate({ title: newTodo.trim() });
  };

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
              disabled={createTodo.isLoading}
              className="rounded-lg border-2 border-black bg-green-500 px-8 py-4 font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {todos.data?.map((todo) => (
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
