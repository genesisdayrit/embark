import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTestTable = pgTable('users_test_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

export type InsertUser = typeof usersTestTable.$inferInsert;
export type SelectUser = typeof usersTestTable.$inferSelect;
