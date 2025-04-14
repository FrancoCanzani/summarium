import EditorSkeleton from "@/components/skeletons/editor-skeleton";
import { getCachedUser } from "@/lib/api/auth";
import { getNote } from "@/lib/api/notes";
import { validateUUID } from "@/lib/utils";
import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

const Editor = dynamic(() => import("@/components/notes/editor"));

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const result = validateUUID(rawId);
  if (!result.success) notFound();
  const id = result.data;

  const userPromise = getCachedUser();
  const notePromise = getNote(id);

  const [{ data, error }, note] = await Promise.all([userPromise, notePromise]);

  if (error || !data || !data.user) {
    redirect("/login");
  }

  if (note && note.user_id !== data.user.id) notFound();

  const initialNote = note ?? {
    id: id!,
    title: "New Note",
    content: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <Suspense fallback={<EditorSkeleton />}>
      <Editor initialNote={initialNote} />
    </Suspense>
  );
}
