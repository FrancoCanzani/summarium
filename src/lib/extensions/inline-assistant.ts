import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import InlineAssistantView from "@/components/inline-assistant";

export interface InlineAssistantOptions {
  HTMLAttributes: Record<string, string>;
}
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    inlineAssistant: {
      // Insert an inline assistant
      insertInlineAssistant: () => ReturnType;
      // Remove all inline assistants
      removeAllInlineAssistants: () => ReturnType;
    };
  }
}
export const InlineAssistant = Node.create<InlineAssistantOptions>({
  name: "inlineAssistant",
  group: "block",
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      id: {
        default: () => Math.random().toString(36).substring(2, 15),
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="inline-assistant"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-type": "inline-assistant" }, HTMLAttributes),
      "",
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(InlineAssistantView);
  },
  addCommands() {
    return {
      insertInlineAssistant:
        () =>
        ({ commands }) => {
          // First remove all existing inline assistants
          commands.removeAllInlineAssistants();

          // Then insert the new one
          return commands.insertContent({
            type: this.name,
            attrs: {
              id: Math.random().toString(36).substring(2, 15),
            },
          });
        },
      removeAllInlineAssistants:
        () =>
        ({ state, dispatch }) => {
          if (!dispatch) return false;

          const { tr } = state;
          let foundAssistants = false;

          // Find all inline assistant nodes
          state.doc.descendants((node, pos) => {
            if (node.type.name === "inlineAssistant") {
              tr.delete(pos, pos + node.nodeSize);
              foundAssistants = true;
            }
          });

          if (!foundAssistants) return false;

          dispatch(tr);
          return true;
        },
    };
  },
});
