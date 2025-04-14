"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import OpenAI from "openai";
import { getCachedUser } from "./api/auth";
import { verifySessionAndGetUserId } from "./api/notes";
import { activitySchema, taskSchema } from "./schemas";
import { createClient } from "./supabase/server";
import { Journal, Note, Task } from "./types";

// --- Journal Actions ---
export async function deleteJournal(id: string): Promise<{ id: string }> {
  const userId = await verifySessionAndGetUserId();
  const supabase = await createClient();

  const { error } = await supabase
    .from("journals")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select("id");

  if (error) {
    console.error(`Error deleting journal ${id} for user ${userId}:`, error);
    throw new Error(error.message);
  }

  revalidatePath("/journal");
  revalidatePath(`/journal/[day]`);
  revalidateTag(`journal-${id}`);

  return { id };
}

export async function saveJournal(
  inputJournal: Omit<Journal, "user_id"> & { user_id?: string; id: string },
): Promise<{ success: boolean; error?: string }> {
  const userId = await verifySessionAndGetUserId();
  const supabase = await createClient();

  try {
    const { data: existingJournal, error: fetchError } = await supabase
      .from("journals")
      .select("id")
      .eq("user_id", userId)
      .eq("day", inputJournal.day)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking existing journal:", fetchError);
      return { success: false, error: fetchError.message };
    }

    const journalToSave: Journal = {
      ...inputJournal,
      id: existingJournal?.id ?? inputJournal.id,
      user_id: userId,
      updated_at: new Date().toISOString(),
      created_at: inputJournal.created_at || new Date().toISOString(),
    };

    const { error } = await supabase.from("journals").upsert(journalToSave, {
      onConflict: "id",
      ignoreDuplicates: false,
    });

    if (error) {
      console.error(
        `Error saving journal ${journalToSave.id} for user ${userId}:`,
        error,
      );
      return { success: false, error: error.message };
    }

    revalidatePath("/journal");
    revalidatePath(`/journal/${journalToSave.day}`);
    revalidateTag(`journal-${journalToSave.id}`);
    revalidateTag(`journal-day-${journalToSave.day}`);

    return { success: true };
  } catch (error) {
    console.error(
      `Unexpected error saving journal ${inputJournal.id} for user ${userId}:`,
      error,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// --- Audio/Note Actions ---
export async function transcribeAudioFile(formData: FormData) {
  const openai = new OpenAI();

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
  revalidateTag(`note-${id}`);

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
      console.error(
        `Error saving note ${noteToSave.id} for user ${userId}:`,
        error,
      );
      return { success: false, error: error.message };
    }

    revalidatePath(`/notes/${noteToSave.id}`);
    revalidatePath("/notes");
    revalidateTag(`note-${noteToSave.id}`);

    return { success: true };
  } catch (error) {
    console.error(
      `Unexpected error saving note ${noteToSave.id} for user ${userId}:`,
      error,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// --- Task Actions ---

export async function createTask(formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    status: formData.get("status"),
    priority: formData.get("priority"),
  };

  const result = taskSchema.safeParse(rawData);

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  const validData = result.data;

  const { data, error: authError } = await getCachedUser();

  if (authError || !data || !data.user) {
    redirect("/login");
  }

  const { error } = await supabase.from("tasks").insert({
    title: validData.title,
    due_date: validData.date,
    description: validData.description,
    status: validData.status,
    priority: validData.priority,
    user_id: data.user.id,
  });

  if (error) {
    return { success: false, errors: error };
  }

  revalidatePath("/tasks");

  return { success: true, data: validData };
}

// todo: this is too abstract and hard to know what it does
export async function updateTask(
  taskId: string,
  updates: Partial<Task>,
): Promise<{ success: boolean; error?: string }> {
  const userId = await verifySessionAndGetUserId();
  const supabase = await createClient();

  const allowedUpdates: Partial<Task> = {};

  if (updates.title !== undefined) allowedUpdates.title = updates.title;
  if (updates.description !== undefined)
    allowedUpdates.description = updates.description;
  if (updates.sanitized_description !== undefined)
    allowedUpdates.sanitized_description = updates.sanitized_description;
  if (updates.status !== undefined) allowedUpdates.status = updates.status;
  if (updates.priority !== undefined)
    allowedUpdates.priority = updates.priority;
  if (updates.due_date !== undefined)
    allowedUpdates.due_date = updates.due_date;

  allowedUpdates.updated_at = new Date().toISOString();

  if (Object.keys(allowedUpdates).length === 1 && allowedUpdates.updated_at) {
    console.warn(
      `UpdateTask called for task ${taskId} with no valid fields to update.`,
    );
    return { success: true };
  }

  const { error } = await supabase
    .from("tasks")
    .update(allowedUpdates)
    .eq("id", taskId)
    .eq("user_id", userId);

  if (error) {
    console.error(
      `Error updating task ${taskId} for user ${userId}:`,
      error.message,
    );
    return { success: false, error: error.message };
  }

  revalidatePath("/tasks");
  revalidateTag(`task-${taskId}`);

  return { success: true };
}

export async function deleteTask(
  taskId: string,
): Promise<{ success: boolean; error?: string }> {
  const userId = await verifySessionAndGetUserId();
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", userId);

  if (error) {
    console.error(
      `Error deleting task ${taskId} for user ${userId}:`,
      error.message,
    );
    return { success: false, error: error.message };
  }

  revalidatePath("/tasks");
  revalidateTag(`task-${taskId}`);

  return { success: true };
}

// -- Activity actions --

export async function createTaskActivity(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const userId = await verifySessionAndGetUserId();
  const supabase = await createClient();

  const rawData = {
    task_id: formData.get("task_id"),
    comment: formData.get("comment"),
  };

  const validationResult = activitySchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Validation failed.",
    };
  }

  const { task_id, comment } = validationResult.data;

  const { error } = await supabase
    .from("activities")
    .insert({
      user_id: userId,
      task_id: task_id,
      comment: comment,
    })
    .select()
    .single();

  if (error) {
    console.error(
      `Error creating activity for task ${task_id} by user ${userId}:`,
      error,
    );
    return { success: false, error: error.message };
  }

  revalidatePath(`/tasks/${task_id}`);
  revalidateTag(`task-activity-${task_id}`);

  return { success: true };
}

export async function deleteTaskActivity(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const userId = await verifySessionAndGetUserId();
  const supabase = await createClient();

  const { error, count } = await supabase
    .from("activities")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error(`Error deleting activity ${id} by user ${userId}:`, error);
    return { success: false, error: error.message };
  }

  if (count === 0) {
    console.warn(
      `Attempted to delete activity ${id} by user ${userId}, but no matching record found or user mismatch.`,
    );
  }

  revalidatePath(`/tasks/${id}`);
  revalidateTag(`task-activity-${id}`);

  return { success: true };
}
