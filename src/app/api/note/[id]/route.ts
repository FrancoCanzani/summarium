import { createClient } from "@/lib/supabase/server";
import { validateUUID } from "@/lib/utils";
import { getCachedUser } from "@/lib/api/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params;

  const result = validateUUID(rawId);

  if (!result.success) {
    return Response.json({ error: "Invalid UUID format" }, { status: 400 });
  }

  const id = result.data;

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await getCachedUser();

  if (!user || authError) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: note, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user?.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return Response.json(null);
    } else {
      return Response.json({ error: "Failed to fetch note" }, { status: 500 });
    }
  }

  return Response.json(note);
}
