"use client";

import { saveNote } from "@/lib/actions";
import { extensions } from "@/lib/extensions/extensions";
import type { Note } from "@/lib/types";
import { EditorContent, useEditor } from "@tiptap/react";
import localForage from "localforage";
import { memo, useMemo, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import AudioTranscriber from "../audio-transcriber";
import { ToolbarProvider } from "../toolbars/toolbar-provider";
import EditorBubbleMenu from "./editor-bubble-menu";
import EditorHeader from "./editor-header";

const MemoizedEditorContent = memo(EditorContent);

export default function Editor({ initialNote }: { initialNote: Note }) {
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [showTranscriber, setShowTranscriber] = useState(false);

  const editorExtensions = useMemo(() => extensions, []);

  const handleSaveNote = async (noteData: Note) => {
    try {
      const result = await saveNote(noteData);

      if (!result.success) {
        toast.error(result.error || "Failed to save note");
      }
    } catch {
      toast.error("There was an error saving your note");
    }
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
      await localForage.setItem(
        `${initialNote.id}+${new Date().toISOString()}`,
        {
          id: initialNote.id,
          title: title,
          content: value,
          sanitized_content: editor?.getText(),
          updated_at: new Date().toISOString(),
        },
      );
    },
    1000,
  );

  const handleContentChange = (value: string) => {
    setContent(value);
    handleDebouncedContentChange(value);
  };

  const editor = useEditor({
    extensions: editorExtensions,
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
        <div className="scrollbar-gutter-stable relative mx-auto flex w-full flex-1 flex-col">
          <EditorHeader
            editor={editor}
            showTranscriber={showTranscriber}
            setShowTranscriber={setShowTranscriber}
          />
          <div className="relative mx-auto flex w-full flex-1 flex-col items-center justify-start space-y-4 p-3 md:w-[65ch]">
            <input
              className="w-full border-none text-xl outline-none md:text-2xl"
              placeholder="Title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
            {/* prevents bubble menu layout shift */}
            <div className="mx-auto h-full w-full md:w-[65ch]">
              <EditorBubbleMenu />
              <MemoizedEditorContent
                editor={editor}
                className="prose prose-p:my-0 prose-sm my-0 h-full min-w-full flex-1 text-start text-black focus:outline-none"
              />

              <div className="sticky bottom-10 z-10 flex justify-center md:bottom-6">
                <AudioTranscriber
                  editor={editor}
                  showTranscriber={showTranscriber}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolbarProvider>
  );
}
