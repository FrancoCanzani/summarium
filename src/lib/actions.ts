"use server"

import OpenAI from "openai";
import { createClient } from "./supabase/server";
import { Note } from "./types";
import { revalidatePath } from "next/cache";
import { verifySessionAndGetUserId } from "./api/notes";

const openai = new OpenAI();

export async function transcribeAudioFile(formData: FormData) {
  try {
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return { error: "No audio file provided" };
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "text",
    });

    return { text: transcription };
  } catch (error) {
    console.error("Transcription error:", error);
    return { error: "Failed to transcribe audio" };
  }
}

export async function deleteNote(id: string): Promise<{ id: string }> {
  const userId = await verifySessionAndGetUserId();
  const supabase = await createClient();

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select("id");

  if (error) {
    console.error(`Error deleting note ${id} for user ${userId}:`, error);
    throw new Error(error.message);
  }

  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);

  return { id: id };
}

export async function saveNote(
  inputNote: Omit<Note, "user_id"> & { user_id?: string; id: string },
): Promise<{ success: boolean; error?: string }> {
  const userId = await verifySessionAndGetUserId();
  const supabase = await createClient();

  const noteToSave: Note = {
    ...inputNote,
    user_id: userId,
    updated_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase
      .from("notes")
      .upsert(noteToSave, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error(`Error saving note ${noteToSave.id} for user ${userId}:`, error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/notes/${noteToSave.id}`);
    revalidatePath("/notes");

    return { success: true };

  } catch (error) {
    console.error(`Unexpected error saving note ${noteToSave.id} for user ${userId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
