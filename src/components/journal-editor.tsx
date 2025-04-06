"use client";

import { extensions } from "@/lib/extensions/extensions";
import { Journal } from "@/lib/types";
import { EditorContent, useEditor } from "@tiptap/react";
import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import EditorFooter from "./editor-footer";
import { ToolbarProvider } from "./toolbars/toolbar-provider";
import EditorBubbleMenu from "./editor-bubble-menu";
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

  useEffect(() => {
    if (initialJournal && editor) {
      if (initialJournal.content !== editor.getHTML()) {
        editor.commands.setContent(initialJournal.content || "");
        setContent(initialJournal.content || "");
        setIsSaved(true);
      }
    }
  }, [initialJournal, editor]);

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
        <EditorFooter editor={editor} isSaved={isSaved} isSaving={isPending} />
      </div>
    </ToolbarProvider>
  );
}
