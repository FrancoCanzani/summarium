import { Editor, Range } from "@tiptap/core";
import { ReactNode } from "react";
import { z } from "zod";
import { taskSchema } from "./schemas";

export interface Note {
  id: string;
  user_id?: string;
  title: string;
  content: string | null;
  encrypted_content?: string | null;
  sanitized_content?: string | null;
  created_at?: string;
  updated_at: string;
  archived_at?: string | null;
  deleted_at?: string | null;
}

export interface Journal {
  id: string;
  user_id?: string;
  day: string;
  content: string | null;
  encrypted_content?: string | null;
  sanitized_content?: string | null;
  created_at?: string;
  updated_at: string;
  archived_at?: string | null;
  deleted_at?: string | null;
}

export interface CommandItem {
  title: string;
  description: string;
  icon: ReactNode;
  command: ({ editor, range }: { editor: Editor; range: Range }) => void;
  category?: string;
  shortcut?: string;
}

type TaskSchema = z.infer<typeof taskSchema>;

export interface Task extends Omit<TaskSchema, "date"> {
  id: string;
  created_at: string;
  updated_at: string;
  due_date: TaskSchema["date"];
  user_id: string;
}

export interface Activity {
  id: string;
  user_id: string;
  task_id: string;
  comment: string | null;
  created_at: string;
  updated_at: string;
}
