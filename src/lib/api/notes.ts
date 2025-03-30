import { Note } from "../types";
import { createClient } from "../supabase/server";
import { redirect } from "next/navigation";
import { cache } from "react";

import "server-only";

export const verifySessionAndGetUserId = cache(async (): Promise<string> => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return user.id;
});

export const getNotes = async (): Promise<Note[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .select()
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching notes:", error);
    throw new Error(error.message);
  }

  return data as Note[];
};

export const getNote = async (id: string): Promise<Note | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error(`Error fetching note ${id}:`, error);
    throw new Error(error.message);
  }

  return data as Note;
};

export const generateNextNoteId = cache(async () => {
  return crypto.randomUUID();
});
