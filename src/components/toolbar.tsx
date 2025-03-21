"use client";

import { Editor } from "@tiptap/react";
import { Separator } from "@/components/ui/separator";
import { BlockquoteToolbar } from "@/components/toolbars/blockquote";
import { BulletListToolbar } from "@/components/toolbars/bullet-list";
import { CodeToolbar } from "@/components/toolbars/code";
import { CodeBlockToolbar } from "@/components/toolbars/code-block";
import { HardBreakToolbar } from "@/components/toolbars/hard-break";
import { HorizontalRuleToolbar } from "@/components/toolbars/horizontal-rule";
import { OrderedListToolbar } from "@/components/toolbars/ordered-list";
import { RedoToolbar } from "@/components/toolbars/redo";
import { SearchAndReplaceToolbar } from "./toolbars/search-and-replace";
import { UndoToolbar } from "./toolbars/undo";
import { ToolbarProvider } from "@/components/toolbars/toolbar-provider";
import { TranscribeToolbar } from "./toolbars/transcribe";
import { Dispatch, SetStateAction } from "react";
import { AssistantToolbar } from "./toolbars/assistant";
import AiAssistantSheet from "./ai-assistant-sheet";
import { ConfirmActionDialog } from "./confirm-action-dialog";
import { Trash, SquarePlus } from "lucide-react";
import { deleteNote } from "@/lib/actions";
import { redirect, useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ButtonWithTooltip from "./ui/button-with-tooltip";

export function Toolbar({
  editor,
  showAssistant,
  setShowAssistant,
  showTranscriber,
  setShowTranscriber,
}: {
  editor: Editor;
  showAssistant: boolean;
  setShowAssistant: Dispatch<SetStateAction<boolean>>;
  showTranscriber: boolean;
  setShowTranscriber: Dispatch<SetStateAction<boolean>>;
}) {
  const { id } = useParams();
  const { user } = useAuth();

  const queryClient = useQueryClient();

  return (
    <ToolbarProvider editor={editor}>
      <div className="flex items-center justify-between gap-2 w-full min-h-full overflow-x-auto">
        <div className="flex items-center justify-start space-x-1.5 min-h-full">
          <UndoToolbar />
          <RedoToolbar />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ButtonWithTooltip
                tooltipText="Blocks"
                variant="ghost"
                size={"icon"}
                className="size-6"
              >
                <SquarePlus className="size-4" />
              </ButtonWithTooltip>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 flex items-start justify-start flex-col">
              <BulletListToolbar
                children={"Bullet list"}
                className="w-full text-start"
              />
              <OrderedListToolbar />
              <CodeToolbar />
              <CodeBlockToolbar />
              <HorizontalRuleToolbar />
              <BlockquoteToolbar />
              <HardBreakToolbar />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-start space-x-1.5">
          <ConfirmActionDialog
            title="Delete this note?"
            description="Are you sure you want to delete this note? This action cannot be undone."
            onConfirm={async () => {
              if (!user) return;

              toast.promise(deleteNote(id as string, user.id), {
                loading: "Loading...",
                success: () => {
                  return `Note has been deleted`;
                },
                error: "Failed to delete note. Please try again.",
              });

              queryClient.invalidateQueries({ queryKey: ["notes"] });

              redirect("/notes");
            }}
          >
            <ButtonWithTooltip
              tooltipText="Delete"
              variant="ghost"
              size="icon"
              className="size-6"
            >
              <Trash className="size-4" />
            </ButtonWithTooltip>
          </ConfirmActionDialog>
          <SearchAndReplaceToolbar />
          <TranscribeToolbar
            onClick={() => {
              setShowTranscriber(!showTranscriber);
            }}
            showTranscriber={showTranscriber}
          />
          <AssistantToolbar
            showAssistant={showAssistant}
            onClick={() => setShowAssistant(!showAssistant)}
          />
          <AiAssistantSheet editor={editor} />
        </div>
      </div>
    </ToolbarProvider>
  );
}
