"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { extensions } from "@/lib/extensions";
import EditorFooter from "./editor-footer";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote } from "@/lib/api/notes";
import { toast } from "sonner";
import { RightSidebar } from "./right-sidebar";
import AiAssistant from "./ai-assistant";
import { Toolbar } from "./toolbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "./ui/sidebar";
import AudioTranscriber from "./audio-transcriber";

export default function Editor() {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showTranscriber, setShowTranscriber] = useState(false);

  const editor = useEditor({
    extensions: extensions,
    content: content,
    onUpdate: ({ editor }) => {
      handleDebouncedContentChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const noteMutation = useMutation({
    // mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsSaved(true);
    },
    onError: () => toast.error("There was an error saving your note"),
  });

  const handleDebouncedTitleChange = useDebouncedCallback((value) => {
    setTitle(value);
    // noteMutation.mutate({id: 1; title: value; content: content})
  }, 1000);

  const handleDebouncedContentChange = useDebouncedCallback((value) => {
    setContent(value);
    // noteMutation.mutate({id: 1; title: title; content: value})
  }, 1000);

  if (!editor) return null;

  return (
    <div className="flex h-svh w-full">
      <div className="flex relative h-svh flex-1 flex-col mx-auto max-w-4xl">
        <input
          className="border-none outline-none text-xl py-2.5 h-12 px-3 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => handleDebouncedTitleChange(e.target.value)}
        />
        <div className="flex items-center justify-start space-x-2 px-3">
          {isMobile && <SidebarTrigger />}
          <Toolbar
            editor={editor}
            setShowAssistant={setShowAssistant}
            showAssistant={showAssistant}
            setShowTranscriber={setShowTranscriber}
            showTranscriber={showTranscriber}
          />
        </div>
        <div className="flex flex-1 overflow-hidden relative">
          <EditorContent
            editor={editor}
            className="prose my-0 px-3 min-w-full h-full overflow-y-auto"
          />
          <AudioTranscriber
            editor={editor}
            setShowTranscriber={setShowTranscriber}
            showTranscriber={showTranscriber}
          />
        </div>

        <EditorFooter editor={editor} isSaved={isSaved} />
      </div>

      <RightSidebar open={showAssistant} onOpenChange={setShowAssistant}>
        <AiAssistant editor={editor} />
      </RightSidebar>
    </div>
  );
}
