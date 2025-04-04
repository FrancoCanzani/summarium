import { BubbleMenu } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  Strikethrough,
  RemoveFormatting,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToolbar } from "./toolbars/toolbar-provider";
import { LinkToolbar } from "./toolbars/link";
import ButtonWithTooltip from "./ui/button-with-tooltip";

export default function EditorBubbleMenu() {
  const editor = useToolbar();

  if (!editor) return null;

  const stylingToolbarItems = [
    {
      icon: <Bold className="size-4" />,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: <Underline className="size-4" />,
      title: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      title: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      icon: <Highlighter className="size-4" />,
      title: "Highlighter",
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive("highlight"),
    },
    {
      icon: <RemoveFormatting className="size-4" />,
      title: "Formatting",
      action: () =>
        editor
          .chain()
          .focus()
          .clearNodes()
          .unsetAllMarks()
          .unsetTextAlign()
          .run(),
      isActive: () => false,
    },
  ];

  return (
    <BubbleMenu
      editor={editor}
      className="bg-background shadow-2xs flex items-center gap-1 rounded-sm border p-1"
    >
      {stylingToolbarItems.map((item, index) => (
        <ButtonWithTooltip
          tooltipText={item.title}
          key={index}
          onClick={item.action}
          variant="ghost"
          size="sm"
          className={cn(
            "size-7 rounded-sm p-1",
            item.isActive() && "bg-accent",
          )}
          title={item.title}
        >
          {item.icon}
        </ButtonWithTooltip>
      ))}
      <LinkToolbar />
    </BubbleMenu>
  );
}
