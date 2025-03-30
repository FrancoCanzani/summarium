import Editor from "@/components/editor";
import { Note } from "@/lib/types";
import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Accessing dynamic data sources such as headers or cookies inside a cache scope
  // is not supported. If you need this data inside a cached function use headers outside
  // of the cached function and pass the required dynamic data in as an argument.

  const getCachedNote = unstable_cache(
    async (id: string) => {
      const { data: note } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single();
      return note;
    },
    [`note-${id}`],
  );

  const note = await getCachedNote(id);

  const initialNote: Note = note ?? {
    id,
    title: "New note",
    content: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return <Editor initialNote={initialNote} />;
}
