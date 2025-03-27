import { useIsMobile } from "@/lib/hooks/use-mobile";
import { deleteNote } from "@/lib/actions";
import { useAuth } from "@/lib/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { Editor } from "@tiptap/core";
import { Trash } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import AiAssistantSheet from "./ai-assistant-sheet";
import { ConfirmActionDialog } from "./confirm-action-dialog";
import EditorVersionControl from "./editor-version-control";
import { AssistantToolbar } from "./toolbars/assistant";
import { InlineAssistantToolbar } from "./toolbars/inline-assistant";
import { SearchAndReplaceToolbar } from "./toolbars/search-and-replace";
import { TranscribeToolbar } from "./toolbars/transcribe";
import ButtonWithTooltip from "./ui/button-with-tooltip";
import { SidebarTrigger } from "./ui/sidebar";

export default function EditorHeader({
  title,
  editor,
  showAssistant,
  setShowAssistant,
  showTranscriber,
  setShowTranscriber,
}: {
  title: string;
  editor: Editor;
  showAssistant: boolean;
  setShowAssistant: Dispatch<SetStateAction<boolean>>;
  showTranscriber: boolean;
  setShowTranscriber: Dispatch<SetStateAction<boolean>>;
}) {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { id } = useParams();

  return (
    <header className="sticky top-0 z-10 bg-sidebar w-full border-b flex flex-col">
      <div className="w-full p-1 flex flex-col space-y-1 items-start justify-start">
        <div className="flex items-center justify-between w-full space-x-1.5 h-full">
          <div className="flex items-center justify-start space-x-1.5">
            {isMobile && <SidebarTrigger />} <h2>{title}</h2>
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
                    queryClient.invalidateQueries({ queryKey: ["notes"] });

                    return `Note has been deleted`;
                  },
                  error: "Failed to delete note. Please try again.",
                });

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
            <EditorVersionControl editor={editor} />
            <SearchAndReplaceToolbar />
            <InlineAssistantToolbar />
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
      </div>
    </header>
  );
}
