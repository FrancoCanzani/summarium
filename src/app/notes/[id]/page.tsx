import Editor from "@/components/editor";
import { Note } from "@/lib/types";
import { getNote } from "@/lib/api/notes";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const start = performance.now();

  const { id } = await params;

  const noteStart = performance.now();

  const note = await getNote(id);

  console.log(
    `Note fetch with caching took ${performance.now() - noteStart}ms`,
  );

  let initialNote: Note;

  if (!note) {
    initialNote = {
      id,
      title: "New note",
      content: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } else {
    initialNote = note;
  }

  console.log(`Total server time: ${performance.now() - start}ms`);

  return <Editor initialNote={initialNote} />;
}
