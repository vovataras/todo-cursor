import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: uuid("user_id"),
});
