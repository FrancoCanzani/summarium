import { ReactNode } from "react";
import { Editor, Range } from "@tiptap/core";

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
}
