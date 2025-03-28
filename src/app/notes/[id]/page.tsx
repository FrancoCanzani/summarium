import Editor from "@/components/editor";
import { fetchNote, preloadNote } from "@/lib/api/notes";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from 'next';
import { Note } from "@/lib/types";

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { id } = await params
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

  preloadNote(user.id, id);

  const note = await fetchNote(user.id, id);

  return {
    title: note ? `Editing: ${note.title}` : "New Note",
    description: note ? `Edit your note "${note.title}"` : "Create a new note",
  };
}

export default async function EditorPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const note = await fetchNote(user.id, id);

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

  return <Editor initialNote={initialNote} />;
}
