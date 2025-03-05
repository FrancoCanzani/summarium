"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { extensions } from "@/lib/extensions";
import { Toolbar } from "./toolbar";

export default function Editor() {
  const editor = useEditor({
    extensions: extensions,
    content: "<p>Hello, Tiptap!</p>",
    immediatelyRender: false,
  });

  return (
    <div className="max-w-5xl py-12 w-full mx-auto">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="prose" />
    </div>
  );
}
