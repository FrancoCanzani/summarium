"use client";

import { extensions } from "@/lib/extensions/extensions";
import { EditorContent, useEditor } from "@tiptap/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { ToolbarProvider } from "./toolbars/toolbar-provider";
import EditorBubbleMenu from "./editor-bubble-menu";
import { saveJournal } from "@/lib/actions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJournal } from "@/lib/fetchers";
import { useSearchParams } from "next/navigation";
import { Journal } from "@/lib/types";

export default function JournalEditor() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const day = searchParams.get("day");
  const today = new Date().toISOString().split("T")[0];
  const selectedDay = day || today;

  const { data: journal } = useQuery({
    queryKey: ["journal", selectedDay],
    queryFn: async () => await fetchJournal(selectedDay),
  });

  const initialJournal: Journal = journal ?? {
    id: crypto.randomUUID(),
    day: selectedDay,
    content: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const [content, setContent] = useState(initialJournal.content);

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setContent(newContent);
      handleDebouncedContentChange(editor.getHTML());
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
  });

  const mutation = useMutation({
    mutationFn: async (journalData: Journal) => {
      const result = await saveJournal(journalData);
      if (!result.success) {
        throw new Error(result.error || "Failed to save journal");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal", selectedDay] });
    },
    onError: (error) => {
      toast.error(error.message || "There was an error saving your journal");
    },
  });

  useEffect(() => {
    if (editor) {
      if (journal?.content !== undefined) {
        editor.commands.setContent(journal.content);
      } else {
        editor.commands.setContent("");
      }
    }
  }, [journal, editor]);

  const handleSaveJournal = (journalData: Partial<Journal>) => {
    mutation.mutate({
      ...journalData,
      id: initialJournal.id,
      updated_at: new Date().toISOString(),
    } as Journal);
  };

  const handleDebouncedContentChange = useDebouncedCallback((value: string) => {
    handleSaveJournal({
      content: value,
      day: initialJournal.day,
      sanitized_content: editor?.getText() || null,
    });
  }, 1000);

  if (!editor) return null;

  return (
    <ToolbarProvider editor={editor}>
      <div className="relative flex h-full w-full flex-col">
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col space-y-4 px-3 py-10">
          <EditorBubbleMenu />
          <EditorContent
            editor={editor}
            className="prose prose-p:my-0 prose-sm my-0 mb-14 h-full min-w-full flex-1 text-start text-black"
          />
        </div>
      </div>
    </ToolbarProvider>
  );
}
