"use client";

import { extensions } from "@/lib/extensions/extensions";
import { Journal } from "@/lib/types";
import { EditorContent, useEditor } from "@tiptap/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import EditorFooter from "./editor-footer";
import { ToolbarProvider } from "./toolbars/toolbar-provider";
import FloatingToolbar from "./editor-floating-toolbar";
import { saveJournal } from "@/lib/actions";

export default function JournalEditor({
  initialJournal,
}: {
  initialJournal: Journal;
}) {
  const [content, setContent] = useState(initialJournal?.content || "");
  const [isSaved, setIsSaved] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleSaveJournal = async (journalData: Partial<Journal>) => {
    startTransition(async () => {
      try {
        const result = await saveJournal({
          ...journalData,
          id: initialJournal.id,
          updated_at: new Date().toISOString(),
        } as Journal);

        if (result.success) {
          setIsSaved(true);
        } else {
          toast.error(result.error || "Failed to save journal");
        }
      } catch {
        toast.error("There was an error saving your journal");
      }
    });
  };

  const handleDebouncedContentChange = useDebouncedCallback(
    async (value: string) => {
      await handleSaveJournal({
        content: value,
        day: initialJournal.day,
        sanitized_content: editor?.getText() || null,
      });
    },
    1000,
  );

  const handleContentChange = (value: string) => {
    setIsSaved(false);
    setContent(value);
    handleDebouncedContentChange(value);
  };

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      handleContentChange(editor.getHTML());
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
  });

  if (!editor) return null;

  return (
    <ToolbarProvider editor={editor}>
      <div className="w-full flex-1">
        <EditorContent
          editor={editor}
          className="prose prose-p:my-0 prose-xs md:prose-sm my-0 mb-14 min-w-full flex-1 text-start text-black"
        />

        <FloatingToolbar />

        <EditorFooter editor={editor} isSaved={isSaved} isSaving={isPending} />
      </div>
    </ToolbarProvider>
  );
}
