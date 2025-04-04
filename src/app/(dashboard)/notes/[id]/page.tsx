import { validateUUID } from "@/lib/utils";
import dynamic from "next/dynamic";
import EditorSkeleton from "@/components/skeletons/editor-skeleton";
import { getNote } from "@/lib/api/notes";
import { getCachedUser } from "@/lib/api/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const Editor = dynamic(() => import("@/components/editor"), {
  loading: () => <EditorSkeleton />,
});

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;

  const result = validateUUID(rawId);

  const id = result.data;

  const { data, error } = await getCachedUser();

  if (error || !data || !data.user) {
    redirect("/login");
  }

  const note = await getNote(id!, data.user.id);

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
