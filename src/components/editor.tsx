"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { extensions } from "@/lib/extensions/extensions";
import EditorFooter from "./editor-footer";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { upsertNote } from "@/lib/api/notes";
import { toast } from "sonner";
import { RightSidebar } from "./right-sidebar";
import AiAssistant from "./ai-assistant";
import { Toolbar } from "./toolbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "./ui/sidebar";
import AudioTranscriber from "./audio-transcriber";
import EditorBubbleMenu from "./editor-bubble-menu";
import AudioPlayer from "./audio-player";
import { Note } from "@/lib/types";

export default function Editor({ initialNote }: { initialNote: Note }) {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

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
      user_id: initialNote.user_id,
      title: value,
      content: content,
      updated_at: new Date().toISOString(),
    });
  }, 1000);

  const handleTitleChange = (value: string) => {
    setIsSaved(false);
    setTitle(value);
    handleDebouncedTitleChange(value);
    setIsSaved(true);
  };

  const handleDebouncedContentChange = useDebouncedCallback((value: string) => {
    upsertNoteMutation.mutate({
      id: initialNote.id,
      user_id: initialNote.user_id,
      title: title,
      content: value,
      updated_at: new Date().toISOString(),
    });
  }, 1000);

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

  if (!editor) return null;

  return (
    <div className="flex min-h-svh w-full">
      <div className="flex relative min-h-svh flex-1 flex-col mx-auto">
        <div className="w-full p-1 sticky top-0 z-10 bg-sidebar border-b-background transition-colors md:border-b-border duration-300 border-b hover:border-b-border">
          <div className="flex items-center justify-start space-x-2 max-w-4xl mx-auto h-full">
            {isMobile && <SidebarTrigger />}
            <Toolbar
              editor={editor}
              setShowAssistant={setShowAssistant}
              showAssistant={showAssistant}
              setShowTranscriber={setShowTranscriber}
              showTranscriber={showTranscriber}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-3 space-y-4 relative max-w-4xl mx-auto w-full">
          <input
            className="border-none text-xl font-medium outline-none"
            placeholder="Title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          <EditorBubbleMenu editor={editor} />
          <EditorContent
            editor={editor}
            className="my-0 min-w-full flex-1 text-start h-full text-sm md:text-base"
          />
          <div className="absolute bottom-0 right-2 flex items-end flex-col justify-center space-y-2">
            <AudioTranscriber
              editor={editor}
              showTranscriber={showTranscriber}
            />
          </div>
        </div>

        <EditorFooter editor={editor} isSaved={isSaved} />
      </div>

      <RightSidebar open={showAssistant} onOpenChange={setShowAssistant}>
        <AiAssistant editor={editor} />
      </RightSidebar>
    </div>
  );
}
