"use client";

import { validateUUID } from "@/lib/utils";
import {
  dehydrate,
  HydrationBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getQueryClient } from "@/lib/utils";
import { fetchNote } from "@/lib/fetchers";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import EditorSkeleton from "@/components/skeletons/editor-skeleton";

const Editor = dynamic(() => import("@/components/editor"), {
  loading: () => <EditorSkeleton />,
});

export default function EditorPage() {
  const { id: rawId } = useParams();

  const result = validateUUID(rawId);

  const queryClient = getQueryClient();

  const id = result.data;

  const { data: note } = useSuspenseQuery({
    queryKey: [`note-${id}`],
    queryFn: async () => await fetchNote(id!),
  });

  const initialNote = note ?? {
    id: id!,
    title: "New Note",
    content: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Editor initialNote={initialNote} />
    </HydrationBoundary>
  );
}
