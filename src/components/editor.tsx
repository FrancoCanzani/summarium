"use client";

import { extensions } from "@/lib/extensions/extensions";
import { Note } from "@/lib/types";
import { EditorContent, useEditor } from "@tiptap/react";
import localForage from "localforage";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import AudioTranscriber from "./audio-transcriber";
import EditorFooter from "./editor-footer";
import EditorHeader from "./editor-header";
import { ToolbarProvider } from "./toolbars/toolbar-provider";
import FloatingToolbar from "./editor-floating-toolbar";
import { saveNote } from "@/lib/actions";

export default function Editor({ initialNote }: { initialNote: Note }) {
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [isSaved, setIsSaved] = useState(true);
  const [showTranscriber, setShowTranscriber] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSaveNote = async (noteData: Note) => {
    startTransition(async () => {
      try {
        const result = await saveNote(noteData);

        if (result.success) {
          setIsSaved(true);
        } else {
          toast.error(result.error || "Failed to save note");
        }
      } catch {
        toast.error("There was an error saving your note");
      }
    });
  };

  const handleDebouncedTitleChange = useDebouncedCallback((value: string) => {
    handleSaveNote({
      id: initialNote.id,
      title: value,
      content: content,
      sanitized_content: editor?.getText(),
      updated_at: new Date().toISOString(),
    });
  }, 1000);

  const handleTitleChange = (value: string) => {
    setIsSaved(false);
    setTitle(value);
    handleDebouncedTitleChange(value);
  };

  const handleDebouncedContentChange = useDebouncedCallback(
    async (value: string) => {
      await handleSaveNote({
        id: initialNote.id,
        title: title,
        content: value,
        sanitized_content: editor?.getText(),
        updated_at: new Date().toISOString(),
      });

      localForage.config({
        name: "summarium_notes_db",
        driver: localForage.INDEXEDDB,
        storeName: "note_versions",
      });
      localForage.setItem(`${initialNote.id}+${new Date().toISOString()}`, {
        id: initialNote.id,
        title: title,
        content: value,
        sanitized_content: editor?.getText(),
        updated_at: new Date().toISOString(),
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
    extensions: extensions,
    content: content,
    onUpdate: ({ editor }) => {
      handleContentChange(editor.getHTML());
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
  });

  if (!editor) return null;

  return (
    <ToolbarProvider editor={editor}>
      <div className="flex min-h-full w-full">
        <div className="relative mx-auto flex min-h-svh flex-1 flex-col">
          <EditorHeader
            editor={editor}
            showTranscriber={showTranscriber}
            setShowTranscriber={setShowTranscriber}
          />

          <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col space-y-4 p-3">
            <input
              className="border-none text-xl font-medium outline-none"
              placeholder="Title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
            <EditorContent
              editor={editor}
              className="prose prose-p:my-0 prose-xs md:prose-sm my-0 mb-14 h-full min-w-full flex-1 text-start text-black"
            />
            <div className="absolute bottom-0 right-2 flex flex-col items-end justify-center space-y-2">
              <AudioTranscriber
                editor={editor}
                showTranscriber={showTranscriber}
              />
            </div>
          </div>

          <FloatingToolbar />

          <EditorFooter
            editor={editor}
            isSaved={isSaved}
            isSaving={isPending}
          />
        </div>
      </div>
    </ToolbarProvider>
  );
}
