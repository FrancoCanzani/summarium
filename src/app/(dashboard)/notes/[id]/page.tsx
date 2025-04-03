"use client";

import Editor from "@/components/editor";
import { validateUUID } from "@/lib/utils";
import {
  dehydrate,
  HydrationBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getQueryClient } from "@/lib/utils";
import { fetchNote } from "@/lib/fetchers";
import { useParams } from "next/navigation";

export default function EditorPage() {
  const { id: rawId } = useParams();

  const result = validateUUID(rawId);

  const queryClient = getQueryClient();

  const id = result.data;

  const { data: note } = useSuspenseQuery({
    queryKey: [`note-${id}`],
    queryFn: () => fetchNote(id!),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Editor initialNote={note} />
    </HydrationBoundary>
  );
}
