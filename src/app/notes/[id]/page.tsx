// import Editor from "@/components/editor";
import { createClient } from "@/lib/supabase/server";
import { Note } from "@/lib/types";
import { getNote } from "@/lib/api/notes";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const start = performance.now();
  const { id } = await params;

  const authStart = performance.now();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  console.log(`Auth took ${performance.now() - authStart}ms`);

  if (!user) return null;

  const noteStart = performance.now();
  const note = await getNote(user.id, id);
  console.log(`Note fetch took ${performance.now() - noteStart}ms`);

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

  console.log(`Total server time: ${performance.now() - start}ms`);
  console.log(initialNote);

  return(
    <div>
      {`Note ID: ${id} for user ${user.id}`}
    </div>
  )
}

// <Editor initialNote={initialNote} user={user} />;
