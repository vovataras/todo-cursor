import { useState } from "react";
import type { Todo } from "~/types/todo";
import { Confetti } from "./Confetti";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [fireConfetti, setFireConfetti] = useState(false);

  const handleToggle = (id: string, completed: boolean) => {
    if (completed) {
      setFireConfetti(true);
      // Reset confetti after animation
      setTimeout(() => setFireConfetti(false), 100);
    }
    onToggle(id, completed);
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-4 rounded-lg border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => handleToggle(todo.id, e.target.checked)}
          className="h-6 w-6 cursor-pointer rounded border-2 border-black accent-green-500"
        />
        <span
          className={`flex-1 text-lg ${
            todo.completed ? "text-gray-500 line-through" : ""
          }`}
        >
          {todo.title}
        </span>
        <button
          onClick={() => onDelete(todo.id)}
          className="rounded-lg border-2 border-black bg-red-500 px-4 py-2 font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
        >
          Delete
        </button>
      </div>
      <Confetti fire={fireConfetti} />
    </>
  );
}
