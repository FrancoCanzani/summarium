import { Note } from "../types";
import { createClient } from "../supabase/client";
import { randomUUID } from "crypto";
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
  const start = performance.now();

  console.log(`fetchNote called with userId: ${userId}, id: ${id}`); // Log on function call
  const { data, error } = await supabase
    .from("notes")
    .select()
    .eq("user_id", userId)
    .eq("id", id)
    .single();

  const end = performance.now();
  console.log("----------------------------------------------");
  console.log(`Fetching data for ${id} took ${Math.round(end - start)}ms`);
  console.log("----------------------------------------------");
  if (data) {
    console.log(`Cache hit for note ${id}`); // Indicate a cache hit
  } else {
    console.log(`Cache miss for note ${id}`); // Indicate a cache miss
  }

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

export async function upsertNote(note: Note): Promise<Note> {
  const { data, error } = await supabase
    .from("notes")
    .upsert(note, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Note;
}

export async function fetchOrCreateNote(
  id: string,
  userId: string,
): Promise<Note> {
  const { data, error } = await supabase
    .from("notes")
    .select()
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    return data as Note;
  }

  const now = new Date().toISOString();
  const newNote: Note = {
    id: randomUUID(),
    user_id: userId,
    title: "",
    content: "",
    created_at: now,
    updated_at: now,
  };

  return await upsertNote(newNote);
}
