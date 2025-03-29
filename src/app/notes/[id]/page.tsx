import { getNote } from "@/lib/api/notes";
import { Note } from "@/lib/types";
import dynamic from 'next/dynamic';
import EditorSkeleton from '@/components/skeletons/editor-skeleton'; // Import skeleton

// Dynamically import the Editor component with SSR disabled and a loading skeleton
const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false, // <-- Disable Server-Side Rendering for the editor
  loading: () => <EditorSkeleton />, // <-- Show skeleton while loading
});

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const start = performance.now();

  const { id } = await params;

  const noteStart = performance.now();
  const note = await getNote(id); // Still fetch data server-side
  console.log(
    `Note fetch (server-side) took ${performance.now() - noteStart}ms`,
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

  console.log(`Total server render time: ${performance.now() - start}ms`);

  // Pass initialNote, Editor component will use it on client
  return <Editor initialNote={initialNote} />;
}
