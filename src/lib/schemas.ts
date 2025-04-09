import { z } from "zod";
import * as chrono from "chrono-node";

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

export const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  date: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return null;
      const parsed = chrono.parseDate(val);
      return parsed ? parsed : null;
    }),
  status: z.string().transform((val) => (val == "" ? "backlog" : val)),
  priority: z.string().transform((val) => (val === "" ? "no-priority" : val)),
});
