"use client";

import { toast } from "sonner";
import { X } from "lucide-react";
import AudioTranscriber from "./audio-transcriber";
import { useToolbar } from "./toolbars/toolbar-provider";

export default function Headless() {
  const editor = useToolbar();

  const showToast = () => {
    toast.custom(
      (t) => (
        <>
          <AudioTranscriber editor={editor} />
          <button
            onClick={() => toast.dismiss(t)}
            className="bg-background hover:bg-accent absolute -right-1 -top-1 rounded-full border"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      ),
      {
        duration: Infinity,
      },
    );
  };

  return (
    <button
      onClick={showToast}
      className="rounded-md bg-blue-600 p-2 text-white transition hover:bg-blue-700"
    >
      Show Toast
    </button>
  );
}
