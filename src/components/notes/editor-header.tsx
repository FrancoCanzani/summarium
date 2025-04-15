import { deleteNote } from "@/lib/actions";
import { Editor } from "@tiptap/core";
import { Trash } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { ConfirmActionDialog } from "../confirm-action-dialog";
import { SearchAndReplaceToolbar } from "../toolbars/search-and-replace";
import { TranscribeToolbar } from "../toolbars/transcribe";
import ButtonWithTooltip from "../ui/button-with-tooltip";
import EditorVersionControl from "./editor-version-control";

export default function EditorHeader({
  editor,
  showTranscriber,
  setShowTranscriber,
}: {
  editor: Editor;
  showTranscriber: boolean;
  setShowTranscriber: Dispatch<SetStateAction<boolean>>;
}) {
  const { id } = useParams();

  return (
    <header className="bg-background sticky top-0 z-10 w-full">
      <div className="flex w-full items-start justify-end p-2">
        <div className="flex items-center justify-start space-x-1.5">
          <ConfirmActionDialog
            title="Delete this note?"
            description="Are you sure you want to delete this note? This action cannot be undone."
            onConfirm={async () => {
              toast.promise(deleteNote(id as string), {
                loading: "Loading...",
                success: () => {
                  return `Note has been deleted`;
                },
                error: "Failed to delete note. Please try again.",
              });

              redirect("/home");
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
          <TranscribeToolbar
            onClick={() => {
              setShowTranscriber(!showTranscriber);
            }}
            showTranscriber={showTranscriber}
          />
        </div>
      </div>
    </header>
  );
}
