import { createClient } from "@/lib/supabase/server";

export async function GET(
  // request has to be here or params is undefined
  request: Request,
  { params }: { params: Promise<{ day: string }> },
) {
  const { day } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: journal, error } = await supabase
    .from("journals")
    .select("*")
    .eq("user_id", user.id)
    .eq("day", day as string)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return Response.json(null);
    }
    console.error(`Error fetching journal for day ${day}:`, error);
    throw new Error(error.message);
  }

  return Response.json(journal);
}
