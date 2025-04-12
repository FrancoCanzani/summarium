import { createClient } from "../supabase/server";
import { Activity, Task } from "../types";

import "server-only";

export const getTasks = async (userId: string): Promise<Task[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select()
    .eq("user_id", userId)
    .order("due_date", { ascending: true });

  if (error) {
    console.error("Error fetching notes:", error);
    throw new Error(error.message);
  }

  return data as Task[];
};

export const getTask = async (id: string): Promise<Task | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(error.message);
  }

  return data as Task;
};

export const getTaskActivities = async (
  taskId: string,
  userId: string,
): Promise<Activity[] | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("activities")
    .select()
    .eq("task_id", taskId)
    .eq("user_id", userId);

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(error.message);
  }

  return data as Activity[];
};
