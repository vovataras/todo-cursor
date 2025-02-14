import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  user_id: uuid("user_id"),
});
