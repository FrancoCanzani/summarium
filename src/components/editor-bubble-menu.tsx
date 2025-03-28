"use client";

import { BoldToolbar } from "@/components/toolbars/bold";
import { BubbleMenu, Editor } from "@tiptap/react";
import { ItalicToolbar } from "@/components/toolbars/italic";
import { UnderlineToolbar } from "./toolbars/underline";
import { HighlightToolbar } from "./toolbars/highlight";
import { StrikeThroughToolbar } from "@/components/toolbars/strikethrough";
import { ToolbarProvider } from "./toolbars/toolbar-provider";
import { LinkToolbar } from "./toolbars/link";

export default function EditorBubbleMenu({ editor }: { editor: Editor }) {
  return (
    <ToolbarProvider editor={editor}>
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className="bg-background flex items-center space-x-1 rounded-md border p-1 text-xs shadow-md"
      >
        <BoldToolbar />
        <ItalicToolbar />
        <StrikeThroughToolbar />
        <UnderlineToolbar />
        <HighlightToolbar />
        <LinkToolbar />
      </BubbleMenu>
    </ToolbarProvider>
  );
}
