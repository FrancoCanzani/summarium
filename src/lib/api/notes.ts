import { Note } from "../types";
import { createClient } from "../supabase/server";
import { cache } from "react";
import { redirect } from "next/navigation";

import "server-only";

export const verifySessionAndGetUserId = cache(async (): Promise<string> => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.log(error);
    redirect("/login");
  }

  return user.id;
});

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
    throw new Error(error.message);
  }

  return data as Note;
};

export const getNotes = async (userId: string): Promise<Note[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .select()
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching notes:", error);
    throw new Error(error.message);
  }

  return data as Note[];
};

export const generateNextNoteId = cache(async () => {
  return crypto.randomUUID();
});
