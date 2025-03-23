"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bot } from "lucide-react";
import { Editor } from "@tiptap/react";
import { useToolbar } from "./toolbar-provider";

export const InlineAssistantToolbar = () => {
  const { editor } = useToolbar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={() => editor.chain().focus().insertInlineAssistant().run()}
        >
          <Bot className="size-4" />
          <span className="sr-only">Insert Inline Assistant</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Insert Inline Assistant</span>
      </TooltipContent>
    </Tooltip>
  );
};
