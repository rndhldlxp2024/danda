import { pgTable, text, timestamp, boolean, integer, jsonb, pgEnum, unique } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["ADMIN", "TEACHER", "STUDENT"]);

// --- Better Auth Tables ---
export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
  role: roleEnum("role").default("STUDENT"),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user.id),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => user.id),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
});

// --- DANDA Business Tables ---
export const classes = pgTable("class", {
  id: text("id").primaryKey(),
  grade: integer("grade").notNull(),
  classNum: integer("class_num").notNull(),
  teacherId: text("teacher_id").notNull().references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (t) => ({
  unq: unique().on(t.grade, t.classNum, t.teacherId)
}));

export const students = pgTable("student", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull().unique(),
  name: text("name").notNull(),
  gender: text("gender"),
  grade: integer("grade").default(1),
  classNum: integer("class_num").default(1),
  number: integer("number"),
  classId: text("class_id").notNull().references(() => classes.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quizzes = pgTable("quiz", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  subject: text("subject"),
  teacherId: text("teacher_id").notNull().references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const questions = pgTable("question", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  options: jsonb("options").notNull(), // Array of strings
  answer: integer("answer").notNull(),
  timeLimit: integer("time_limit").default(30),
  points: integer("points").default(1000),
  quizId: text("quiz_id").notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quizSessions = pgTable("quiz_session", {
  id: text("id").primaryKey(),
  quizId: text("quiz_id").notNull().references(() => quizzes.id),
  entryCode: text("entry_code").notNull().unique(),
  status: text("status").default("WAITING"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quizResults = pgTable("quiz_result", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => quizSessions.id),
  studentId: text("student_id").notNull(),
  score: integer("score").notNull(),
  answers: jsonb("answers").notNull(), // Array of points
  createdAt: timestamp("created_at").defaultNow(),
});
