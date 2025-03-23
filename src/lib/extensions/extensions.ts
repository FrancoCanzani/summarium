import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { InlineSuggestion } from "./suggestion-extension";
import SearchAndReplace from "./search-and-replace-extension";
import Link from "@tiptap/extension-link";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import { Markdown } from "tiptap-markdown";
import { InlineAssistant } from "./inline-assistant";

export const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal",
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc",
      },
    },
    code: {
      HTMLAttributes: {
        class: "bg-accent rounded-md p-1",
      },
    },
    horizontalRule: {
      HTMLAttributes: {
        class: "my-2",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: "bg-primary text-primary-foreground p-2 text-sm rounded-md p-1",
      },
    },
    heading: {
      levels: [1, 2, 3, 4],
      HTMLAttributes: {
        class: "tiptap-heading",
      },
    },
  }),
  InlineAssistant,
  TaskList,
  TaskItem,
  CharacterCount,
  Highlight,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Underline,
  SearchAndReplace,
  Link.configure({
    HTMLAttributes: {
      class: "text-blue-500 underline cursor-pointer",
    },
  }),
  Markdown,
  Placeholder.configure({
    emptyEditorClass: "is-editor-empty",
    placeholder: "Write something…",
  }),
  InlineSuggestion.configure({
    fetchAutocompletion: async (query) => {
      const res = await fetch(`/api/suggestion?query=${query}`);

      if (!res.ok) {
        return;
      }

      const json = await res.json();

      console.log(json.text);

      return json.text;
    },
  }),
];
