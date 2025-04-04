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
