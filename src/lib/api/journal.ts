import { Journal } from "../types";
import { createClient } from "../supabase/server";
import { verifySessionAndGetUserId } from "./notes";

import "server-only";

export async function getJournalByDay(day: string): Promise<Journal | null> {
  const userId = await verifySessionAndGetUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("journals")
    .select("*")
    .eq("user_id", userId)
    .eq("day", day)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error(`Error fetching journal for day ${day}:`, error);
    throw new Error(error.message);
  }

  return data;
}
