"use server";

import OpenAI from "openai";
import { createClient } from "./supabase/server";
import { Note } from "./types";
import { revalidatePath } from "next/cache";

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

export async function deleteNote(
  id: string,
  userId: string,
): Promise<{ id: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select("id");

  if (error) {
    throw new Error(error.message);
  }

  return { id: id };
}

export async function saveNote(
  note: Note,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("notes")
      .upsert(note, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("Error saving note:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/notes/${note.id}`);

    return { success: true };
  } catch (error) {
    console.error("Unexpected error saving note:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
