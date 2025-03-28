"use client";

import { BlockquoteToolbar } from "@/components/toolbars/blockquote";
import { BoldToolbar } from "@/components/toolbars/bold";
import { BulletListToolbar } from "@/components/toolbars/bullet-list";
import { CodeToolbar } from "@/components/toolbars/code";
import { CodeBlockToolbar } from "@/components/toolbars/code-block";
import { HardBreakToolbar } from "@/components/toolbars/hard-break";
import { HorizontalRuleToolbar } from "@/components/toolbars/horizontal-rule";
import { ItalicToolbar } from "@/components/toolbars/italic";
import { OrderedListToolbar } from "@/components/toolbars/ordered-list";
import { RedoToolbar } from "@/components/toolbars/redo";
import { StrikeThroughToolbar } from "@/components/toolbars/strikethrough";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Code,
  Code2,
  List,
  ListOrdered,
  SeparatorHorizontal,
  SquareCheck,
  SquarePlus,
  TextQuote,
  WrapText,
} from "lucide-react";
import { AlignmentToolbar } from "./toolbars/alignment";
import { ClearFormattingToolbar } from "./toolbars/clear-formatting";
import { HighlightToolbar } from "./toolbars/highlight";
import { LinkToolbar } from "./toolbars/link";
import { TaskListToolbar } from "./toolbars/task-list";
import { UnderlineToolbar } from "./toolbars/underline";
import { UndoToolbar } from "./toolbars/undo";
import ButtonWithTooltip from "./ui/button-with-tooltip";

export function Toolbar() {
  return (
    <div className="flex min-h-full w-full items-center justify-between gap-2 overflow-x-auto">
      <div className="flex min-h-full items-center justify-start space-x-2">
        <div className="flex items-center justify-start space-x-2 border-r pr-1">
          <UndoToolbar />
          <RedoToolbar />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonWithTooltip
              tooltipText="Insert block"
              variant="ghost"
              size={"icon"}
              className="size-6"
            >
              <SquarePlus className="size-4" />
            </ButtonWithTooltip>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex w-48 flex-col items-start justify-start space-y-1 text-start">
            <TaskListToolbar className="flex h-8 w-full items-center justify-start space-x-1.5 rounded-sm px-1.5 py-2.5">
              <SquareCheck className="size-4" /> <span>Task list</span>
            </TaskListToolbar>
            <BulletListToolbar className="flex h-8 w-full items-center justify-start space-x-1.5 rounded-sm px-1.5 py-2.5">
              <List className="size-4" /> <span>Bullet list</span>
            </BulletListToolbar>
            <OrderedListToolbar className="flex h-8 w-full items-center justify-start space-x-1.5 rounded-sm px-1.5 py-2.5">
              <ListOrdered className="size-4" /> <span>Ordered list</span>
            </OrderedListToolbar>
            <CodeToolbar className="flex h-8 w-full items-center justify-start space-x-1.5 rounded-sm px-1.5 py-2.5">
              <Code2 className="size-4" /> <span>Code</span>
            </CodeToolbar>
            <CodeBlockToolbar className="flex h-8 w-full items-center justify-start space-x-1.5 rounded-sm px-1.5 py-2.5">
              <Code className="size-4" /> <span>Code block</span>
            </CodeBlockToolbar>
            <HorizontalRuleToolbar className="flex h-8 w-full items-center justify-start space-x-1.5 rounded-sm px-1.5 py-2.5">
              <SeparatorHorizontal className="size-4" />
              <span>Separator</span>
            </HorizontalRuleToolbar>
            <BlockquoteToolbar className="flex h-8 w-full items-center justify-start space-x-1.5 rounded-sm px-1.5 py-2.5">
              <TextQuote className="size-4" /> <span>Blockquote</span>
            </BlockquoteToolbar>
            <HardBreakToolbar className="flex h-8 w-full items-center justify-start space-x-1.5 rounded-sm px-1.5 py-2.5">
              <WrapText className="size-4" /> <span>Hard break</span>
            </HardBreakToolbar>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center justify-start space-x-2 border-l pl-1">
          <BoldToolbar />
          <ItalicToolbar />
          <StrikeThroughToolbar />
          <UnderlineToolbar />
          <HighlightToolbar />
          <LinkToolbar />
          <ClearFormattingToolbar />
          <AlignmentToolbar />
        </div>
      </div>
    </div>
  );
}
