import { cache } from "react";
import { createClient } from "../supabase/server";
import "server-only";

export const getCachedUser = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  return { data, error };
});
