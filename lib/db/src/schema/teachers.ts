import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { authUserTable } from "./auth-user";

export const teachersTable = pgTable("teachers", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .notNull()
    .unique()
    .references(() => authUserTable.id, { onDelete: "cascade" }),
  university_name: text("university_name").notNull(),
  gender: text("gender").notNull(),
  year_joined: integer("year_joined").notNull(),
  subject: text("subject").notNull(),
  bio: text("bio"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTeacherSchema = createInsertSchema(teachersTable).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = typeof teachersTable.$inferSelect;
