import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger } from "./ui/sidebar";
import { Toolbar } from "./toolbar";
import { Editor } from "@tiptap/core";
import { Dispatch, SetStateAction } from "react";

export default function EditorHeader({
  editor,
  showAssistant,
  setShowAssistant,
}: {
  editor: Editor;
  showAssistant: boolean;
  setShowAssistant: Dispatch<SetStateAction<boolean>>;
}) {
  const isMobile = useIsMobile();

  return <header className="py-5 px-3 overflow-hidden"></header>;
}
