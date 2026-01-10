import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Boards
export const boards = pgTable("boards", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description"),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Board Members
export const boardMembers = pgTable("board_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull().default("viewer"), // owner, editor, viewer
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Columns
export const columns = pgTable("columns", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 100 }).notNull(),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tasks
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  columnId: uuid("column_id")
    .notNull()
    .references(() => columns.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  position: integer("position").notNull(),
  priority: varchar("priority", { length: 20 }).default("medium"), // low, medium, high
  assignedTo: uuid("assigned_to").references(() => users.id, {
    onDelete: "set null",
  }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Comments
export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Activities
export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  action: varchar("action", { length: 50 }).notNull(), // created, updated, deleted, moved, commented
  entityType: varchar("entity_type", { length: 50 }).notNull(), // board, column, task, comment
  entityId: uuid("entity_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== RELATIONS =====

export const usersRelations = relations(users, ({ many }) => ({
  ownedBoards: many(boards),
  boardMemberships: many(boardMembers),
  createdTasks: many(tasks, { relationName: "creator" }),
  assignedTasks: many(tasks, { relationName: "assignee" }),
  comments: many(comments),
  activities: many(activities),
}));

export const boardsRelations = relations(boards, ({ one, many }) => ({
  owner: one(users, {
    fields: [boards.ownerId],
    references: [users.id],
  }),
  members: many(boardMembers),
  columns: many(columns),
  activities: many(activities),
}));

export const boardMembersRelations = relations(boardMembers, ({ one }) => ({
  board: one(boards, {
    fields: [boardMembers.boardId],
    references: [boards.id],
  }),
  user: one(users, {
    fields: [boardMembers.userId],
    references: [users.id],
  }),
}));

export const columnsRelations = relations(columns, ({ one, many }) => ({
  board: one(boards, {
    fields: [columns.boardId],
    references: [boards.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  column: one(columns, {
    fields: [tasks.columnId],
    references: [columns.id],
  }),
  assignedUser: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
    relationName: "assignee",
  }),
  creator: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
    relationName: "creator",
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  board: one(boards, {
    fields: [activities.boardId],
    references: [boards.id],
  }),
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));
