"use client";

import { upsertNote } from "@/lib/api/notes";
import { extensions } from "@/lib/extensions/extensions";
import { useAuth } from "@/lib/hooks/use-auth";
import { Note } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditorContent, useEditor } from "@tiptap/react";
import localForage from "localforage";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import AiAssistant from "./ai-assistant";
import AudioTranscriber from "./audio-transcriber";
import EditorFooter from "./editor-footer";
import EditorHeader from "./editor-header";
import { RightSidebar } from "./right-sidebar";
import { ToolbarProvider } from "./toolbars/toolbar-provider";
import FloatingToolbar from "./editor-floating-toolbar";

export default function Editor({ initialNote }: { initialNote: Note }) {
  const { user, loading } = useAuth();


  const queryClient = useQueryClient();

  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [isSaved, setIsSaved] = useState(true);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showTranscriber, setShowTranscriber] = useState(false);

  const upsertNoteMutation = useMutation({
    mutationFn: upsertNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsSaved(true);
    },
    onError: () => toast.error("There was an error saving your note"),
  });

  const handleDebouncedTitleChange = useDebouncedCallback((value: string) => {
    upsertNoteMutation.mutate({
      id: initialNote.id,
      user_id: user!.id,
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
    setIsSaved(true);
  };

  const handleDebouncedContentChange = useDebouncedCallback(
    async (value: string) => {
      upsertNoteMutation.mutate({
        id: initialNote.id,
        user_id: user!.id,
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
        user_id: user!.id,
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
    setIsSaved(true);
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

  if (!user && !loading) return;

  if (!editor) return null;

  return (
    <ToolbarProvider editor={editor}>
      <div className="flex min-h-svh w-full">
        <div className="flex relative min-h-svh flex-1 flex-col mx-auto">
          <EditorHeader
            title={title}
            editor={editor}
            showAssistant={showAssistant}
            setShowAssistant={setShowAssistant}
            showTranscriber={showTranscriber}
            setShowTranscriber={setShowTranscriber}
          />

          <div className="flex flex-1 flex-col p-3 relative space-y-4 max-w-4xl mx-auto w-full">
            <input
              className="border-none text-xl font-medium outline-none"
              placeholder="Title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
            <EditorContent
              editor={editor}
              className="my-0 mb-14 min-w-full prose text-black prose-p:my-0 prose-xs md:prose-sm flex-1 text-start h-full"
            />
            <div className="absolute bottom-0 right-2 flex items-end flex-col justify-center space-y-2">
              <AudioTranscriber
                editor={editor}
                showTranscriber={showTranscriber}
              />
            </div>
          </div>
          <FloatingToolbar />

          <EditorFooter editor={editor} isSaved={isSaved} />
        </div>

        <RightSidebar open={showAssistant}>
          <AiAssistant editor={editor} />
        </RightSidebar>
      </div>
    </ToolbarProvider>
  );
}
