import Editor from "@/components/editor";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { Note } from "@/lib/types";
import { getNote } from "@/lib/api/notes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      title: "Note Editor",
      description: "Please sign in to access the note editor",
    };
  }

  const note = await getNote(user.id, id);

  return {
    title: note ? `Editing: ${note.title}` : "New Note",
    description: note ? `Edit your note "${note.title}"` : "Create a new note",
  };
}

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const note = await getNote(user.id, id);

  let initialNote: Note;

  if (!note) {
    initialNote = {
      id,
      user_id: user.id,
      title: "New note",
      content: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } else {
    initialNote = note;
  }

  return <Editor initialNote={initialNote} user={user} />;
}
