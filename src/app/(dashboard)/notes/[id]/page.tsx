import Editor from "@/components/editor";
import { Note } from "@/lib/types";
import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { validateUUID } from "@/lib/utils";
import { notFound } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = validateUUID(rawId);
  const supabase = await createClient();

  const getCachedNote = unstable_cache(
    async (noteId: string, client: SupabaseClient) => {
      const { data: note } = await client
        .from("notes")
        .select("*")
        .eq("id", noteId)
        .single();
      return note;
    },
    [`note-${id}`],
  );

  try {
    const note = await getCachedNote(id, supabase);

    const initialNote: Note = note ?? {
      id,
      title: "New note",
      content: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return <Editor initialNote={initialNote} />;
  } catch {
    notFound();
  }
}
