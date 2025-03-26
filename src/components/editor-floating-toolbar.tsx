import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MoreHorizontal,
  Type,
  Highlighter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToolbar } from "./toolbars/toolbar-provider";
import { useIsMobile } from "@/hooks/use-mobile";

export default function FloatingToolbar() {
  const editor = useToolbar();
  const isMobile = useIsMobile();

  if (!editor) return null;

  const toolbarItems = [
    {
      icon: <Bold className="h-4 w-4" />,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
      priority: "high",
    },
    {
      icon: <Italic className="h-4 w-4" />,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
      priority: "high",
    },
    {
      icon: <Underline className="h-4 w-4" />,
      title: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
      priority: "medium",
    },
    {
      icon: <List className="h-4 w-4" />,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
      priority: "high",
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
      priority: "medium",
    },
    {
      icon: <Code className="h-4 w-4" />,
      title: "Code",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
      priority: "low",
    },
    {
      icon: <Link className="h-4 w-4" />,
      title: "Link",
      action: () => {
        const url = window.prompt("URL");
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      },
      isActive: () => editor.isActive("link"),
      priority: "medium",
    },
    {
      icon: <AlignLeft className="h-4 w-4" />,
      title: "Align Left",
      action: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: () => editor.isActive({ textAlign: "left" }),
      priority: "low",
    },
    {
      icon: <AlignCenter className="h-4 w-4" />,
      title: "Align Center",
      action: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: () => editor.isActive({ textAlign: "center" }),
      priority: "low",
    },
    {
      icon: <AlignRight className="h-4 w-4" />,
      title: "Align Right",
      action: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: () => editor.isActive({ textAlign: "right" }),
      priority: "low",
    },
  ];

  // Filter items based on screen size
  const visibleItems = isMobile
    ? toolbarItems.filter((item) => item.priority === "high")
    : toolbarItems.filter(
        (item) => item.priority === "high" || item.priority === "medium",
      );

  const moreMenuItems = isMobile
    ? toolbarItems.filter((item) => item.priority !== "high")
    : toolbarItems.filter((item) => item.priority === "low");

  const headingLevels = [
    { level: 1, title: "Heading 1" },
    { level: 2, title: "Heading 2" },
    { level: 3, title: "Heading 3" },
    { level: 4, title: "Heading 4" },
    { level: 5, title: "Heading 5" },
    { level: 6, title: "Heading 6" },
  ];

  const highlightColors = [
    { color: "#FFFF00", label: "Yellow" },
    { color: "#FF9900", label: "Orange" },
    { color: "#FF0000", label: "Red" },
    { color: "#00FF00", label: "Green" },
    { color: "#00FFFF", label: "Cyan" },
    { color: "#0000FF", label: "Blue" },
    { color: "#9900FF", label: "Purple" },
    { color: "#FF00FF", label: "Magenta" },
    { color: "#FFFFFF", label: "White" },
    {
      color: "transparent",
      label: "Clear",
      action: () => editor.chain().focus().unsetHighlight().run(),
    },
  ];

  return (
    <div
      className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-10 bg-zed-light border rounded-md shadow-md"
    >
      <div className="flex flex-wrap items-center justify-center p-0.5 gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "size-8",
                editor.isActive("heading") && "bg-accent",
              )}
              title="Headings"
            >
              <Type className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {headingLevels.map((heading) => (
              <DropdownMenuItem
                key={heading.level}
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: heading.level })
                    .run()
                }
                className={cn(
                  "flex items-center gap-2 text-sm",
                  editor.isActive("heading", { level: heading.level }) &&
                    "bg-accent",
                )}
              >
                <span>{heading.title}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={cn(
                "flex items-center gap-2 text-sm",
                editor.isActive("paragraph") && "bg-accent",
              )}
            >
              <span>Paragraph</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {visibleItems.map((item, index) => (
          <Button
            key={index}
            onClick={item.action}
            variant="ghost"
            size="sm"
            className={cn(
              "size-8",
              item.isActive() && "bg-accent",
            )}
            title={item.title}
          >
            {item.icon}
          </Button>
        ))}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "size-8",
                editor.isActive("highlight") &&
                  "bg-accent",
              )}
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="center">
            <div className="grid grid-cols-5 gap-1">
              {highlightColors.map((item, index) =>
                item.color !== "transparent" ? (
                  <button
                    key={index}
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .setHighlight({ color: item.color })
                        .run()
                    }
                    className={cn(
                      "w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center",
                      editor.isActive("highlight", { color: item.color }) &&
                        "ring-2 ring-neutral-400",
                    )}
                    title={item.label}
                    style={{ backgroundColor: item.color }}
                  />
                ) : (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center"
                    title={item.label}
                  >
                    <span className="text-xs">✕</span>
                  </button>
                ),
              )}
            </div>
          </PopoverContent>
        </Popover>

        {moreMenuItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="size-8"
                title="More formatting options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {moreMenuItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={item.action}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    item.isActive() && "bg-accent",
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
