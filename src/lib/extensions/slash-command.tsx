"use client";

import { Editor, Extension, Range } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance as TippyInstance } from "tippy.js";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
  CheckSquare,
} from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { CommandItem } from "../types";

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
              title: "Heading 1",
              description: "Large section heading",
              icon: <Heading1 className="h-4 w-4" />,
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
              icon: <Heading2 className="h-4 w-4" />,
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
              icon: <Heading3 className="h-4 w-4" />,
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
              icon: <List className="h-4 w-4" />,
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
              title: "Numbered List",
              description: "Create a numbered list",
              icon: <ListOrdered className="h-4 w-4" />,
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
              icon: <CheckSquare className="h-4 w-4" />,
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
              title: "Bold",
              description: "Make text bold",
              icon: <Bold className="h-4 w-4" />,
              command: ({
                editor,
                range,
              }: {
                editor: Editor;
                range: Range;
              }) => {
                editor.chain().focus().deleteRange(range).setMark("bold").run();
              },
            },
            {
              title: "Italic",
              description: "Make text italic",
              icon: <Italic className="h-4 w-4" />,
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
                  .setMark("italic")
                  .run();
              },
            },
            {
              title: "Code Block",
              description: "Add a code block",
              icon: <Code className="h-4 w-4" />,
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
                  .toggleCodeBlock()
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

    if (props.items.length === 0) {
      return null;
    }

    return (
      <div className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-md">
        {props.items.map((item, index) => (
          <button
            key={index}
            className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100 ${
              index === selectedIndex ? "bg-gray-100" : ""
            }`}
            onClick={() => selectItem(index)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white">
              {item.icon}
            </div>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          </button>
        ))}
      </div>
    );
  },
);
CommandList.displayName = "CommandList";
