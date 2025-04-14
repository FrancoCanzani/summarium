import { z } from "zod";

export const AuthSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export const uuidV4Schema = z.string().uuid("Invalid UUID format");

export const journalDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .date();

export const activitySchema = z.object({
  task_id: z.string().uuid({ message: "Invalid Task ID format." }),
  comment: z
    .string()
    .min(1, { message: "Comment cannot be empty." })
    .max(1000, { message: "Comment cannot exceed 1000 characters." }),
});

export const SingleTaskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  date: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
});

export const MultiTaskSchema = z.object({
  tasks: z.array(SingleTaskSchema),
});

const TaskStatus = z.enum([
  "backlog",
  "todo",
  "in-progress",
  "complete",
  "wont-do",
]);

const TaskPriority = z.enum(["no-priority", "urgent", "high", "medium", "low"]);

export const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  sanitized_description: z.string().optional(),
  date: z.string().optional().nullable(),
  status: TaskStatus.optional().transform(
    (val) => val?.toLowerCase() ?? "backlog",
  ),
  priority: TaskPriority.optional().transform(
    (val) => val?.toLowerCase() ?? "no-priority",
  ),
});
