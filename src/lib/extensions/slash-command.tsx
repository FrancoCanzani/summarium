"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import { Editor, Extension, Range } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance as TippyInstance } from "tippy.js";
import {
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  CheckSquare,
  Quote,
  Minus,
  Bot,
  Text,
} from "lucide-react";
import { CommandItem } from "../types";
import { updateScrollView } from "../utils";

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: { command: (args: { editor: Editor; range: Range }) => void };
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          const items: CommandItem[] = [
            {
              title: "Text",
              description: "Paragraph",
              icon: <Text className="size-4" />,
              category: "Content",
              shortcut: "",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor.chain().focus().deleteRange(range).setParagraph().run();
              },
            },
            {
              title: "Heading 1",
              description: "Large section heading",
              icon: <Heading1 className="size-4" />,
              category: "Content",
              shortcut: "#",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode("heading", { level: 1 })
                  .run();
              },
            },
            {
              title: "Heading 2",
              description: "Medium section heading",
              icon: <Heading2 className="size-4" />,
              category: "Content",
              shortcut: "##",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode("heading", { level: 2 })
                  .run();
              },
            },
            {
              title: "Heading 3",
              description: "Small section heading",
              icon: <Heading3 className="size-4" />,
              category: "Content",
              shortcut: "###",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode("heading", { level: 3 })
                  .run();
              },
            },
            {
              title: "Bullet List",
              description: "Create a simple bullet list",
              icon: <List className="size-4" />,
              category: "Lists",
              shortcut: "-",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleBulletList()
                  .run();
              },
            },
            {
              title: "Ordered list",
              description: "Create a numbered list",
              icon: <ListOrdered className="size-4" />,
              category: "Lists",
              shortcut: "1.",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleOrderedList()
                  .run();
              },
            },
            {
              title: "Task List",
              description: "Create a task list",
              icon: <CheckSquare className="size-4" />,
              category: "Lists",
              shortcut: "[]",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleTaskList()
                  .run();
              },
            },
            {
              title: "Quote",
              description: "Insert a blockquote",
              icon: <Quote className="size-4" />,
              category: "Blocks",
              shortcut: "|",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleBlockquote()
                  .run();
              },
            },
            {
              title: "Divider",
              description: "Insert a horizontal rule",
              icon: <Minus className="size-4" />,
              category: "Blocks",
              shortcut: "---",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setHorizontalRule()
                  .run();
              },
            },
            {
              title: "Inline Assistant",
              description: "Insert AI assistant block",
              icon: <Bot className="size-4" />,
              category: "Blocks",
              shortcut: "todo",
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .insertInlineAssistant()
                  .run();
              },
            },
          ];

          if (typeof query === "string" && query.length > 0) {
            return items.filter((item) =>
              item.title.toLowerCase().includes(query.toLowerCase()),
            );
          }
          return items;
        },
        render: () => {
          let component: ReactRenderer<CommandListRef, CommandListProps>;
          let popup: TippyInstance[];
          return {
            onStart: (props: { editor: Editor; clientRect: () => DOMRect }) => {
              component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
              });

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },
            onUpdate(props: { clientRect: () => DOMRect }) {
              component.updateProps(props);

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              });
            },
            onKeyDown(props: { event: KeyboardEvent }) {
              if (props.event.key === "Escape") {
                popup[0].hide();
                return true;
              }

              return component.ref?.onKeyDown(props) ?? false;
            },
            onExit() {
              popup[0].destroy();
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});

interface CommandListProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

interface CommandListRef {
  onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean;
}

const CommandList = forwardRef<CommandListRef, CommandListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectItem = (index: number) => {
      const item = props.items[index];
      if (item) {
        props.command(item);
      }
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === "ArrowUp") {
          setSelectedIndex(
            (selectedIndex + props.items.length - 1) % props.items.length,
          );
          return true;
        }

        if (event.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % props.items.length);
          return true;
        }

        if (event.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }

        return false;
      },
    }));

    useEffect(() => {
      setSelectedIndex(0);
    }, [props.items]);

    useLayoutEffect(() => {
      const container = containerRef.current;
      const item = container?.querySelector(
        `[data-index="${selectedIndex}"]`,
      ) as HTMLElement;
      if (container && item) {
        updateScrollView(container, item);
      }
    }, [selectedIndex]);

    if (props.items.length === 0) {
      return null;
    }

    let lastCategory: string | undefined = undefined;

    return (
      <div
        ref={containerRef}
        className="no-scrollbar bg-background shadow-2xs z-50 h-auto max-h-[330px] w-56 overflow-y-auto rounded-sm border p-1"
      >
        {props.items.map((item, index) => {
          const showCategoryHeader =
            item.category && item.category !== lastCategory;
          lastCategory = item.category;
          return (
            <React.Fragment key={index}>
              {showCategoryHeader && (
                <div className="p-2 text-xs font-medium text-gray-700">
                  {item.category}
                </div>
              )}
              <button
                data-index={index}
                className={`hover:bg-accent flex w-full items-center justify-between rounded-sm p-2 text-left text-sm ${
                  index === selectedIndex ? "bg-accent text-black" : ""
                }`}
                onClick={() => selectItem(index)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-700">{item.icon}</div>
                  <p className="text-xs font-medium text-gray-700">
                    {item.title}
                  </p>
                </div>
                {item.shortcut && (
                  <span className="text-xs text-gray-700">{item.shortcut}</span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    );
  },
);
CommandList.displayName = "CommandList";
