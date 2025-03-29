import { Note } from "../types";
import { createClient } from "../supabase/client";
import { cache } from "react";

const supabase = createClient();

export const fetchNotes = async (userId: string): Promise<Note[]> => {
  const { data, error } = await supabase
    .from("notes")
    .select()
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Note[];
};

export const fetchNote = async (userId: string, id: string) => {
  const { data, error } = await supabase
    .from("notes")
    .select()
    .eq("user_id", userId)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(error.message);
  }

  return data as Note;
};

export const getNote = cache(fetchNote);

export const preloadNote = (userId: string, id: string) => {
  void getNote(userId, id);
};
