export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  user_id: string;
};

export type CreateTodoInput = {
  title: string;
};

export type UpdateTodoInput = {
  id: string;
  completed?: boolean;
  title?: string;
};
