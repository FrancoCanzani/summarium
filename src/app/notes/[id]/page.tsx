import Editor from "@/components/editor";
import { fetchNotes } from "@/lib/api/notes";
import { createClient } from "@/lib/supabase/server";
import { Note } from "@/lib/types";
import { getQueryClient } from "@/lib/utils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { randomUUID } from "crypto";
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { id } = await params;

  const queryClient = getQueryClient();
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

  await queryClient.prefetchQuery({
    queryKey: ["notes"],
    queryFn: () => fetchNotes(user.id),
  });

  const notes = queryClient.getQueryData<Note[]>(["notes"]);
  const note = notes?.find((n) => n.id === id);

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
  const queryClient = getQueryClient();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await queryClient.prefetchQuery({
    queryKey: ["notes"],
    queryFn: () => fetchNotes(user.id),
  });

  const dehydratedState = dehydrate(queryClient);
  const notes = queryClient.getQueryData<Note[]>(["notes"]);
  let initialNote = notes?.find((n) => n.id === id);

  if (!initialNote) {
    initialNote = {
      id: randomUUID(),
      user_id: user.id,
      title: "New note",
      content: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return (
    <HydrationBoundary state={dehydratedState}>
        <Editor initialNote={initialNote} />
    </HydrationBoundary>
  );
}
