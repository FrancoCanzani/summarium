"use client";

import { useCompletion } from "@ai-sdk/react";
import { Editor, NodeViewWrapper } from "@tiptap/react";
import { Button } from "./ui/button";
import { Check, LoaderCircle, Sparkle, X } from "lucide-react";
import { toast } from "sonner";
import { useRef, useEffect } from "react";

export default function InlineAssistantView({ editor }: { editor: Editor }) {
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, []);

  const {
    complete,
    completion,
    setCompletion,
    isLoading,
    error,
    input,
    setInput,
    handleInputChange,
  } = useCompletion({
    api: "/api/completion",
  });

  const handleGenerate = async () => {
    if (!editor) return;

    await complete(input);

    if (error) {
      toast.error("There was an error generating the completion");
      return;
    }

    setInput("");
  };

  return (
    <NodeViewWrapper>
      <form className="flex my-2 items-center w-full space-x-1">
        <Button
          onClick={() => editor.commands.removeAllInlineAssistants()}
          disabled={isLoading}
          variant={"ghost"}
          size={"icon"}
          type="button"
        >
          <X className="size-3" />
        </Button>
        <input
          type="text"
          placeholder="Ask AI..."
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
          autoFocus
          ref={inputRef}
          className="w-full border border-gray-100 rounded-sm px-2 py-1"
        />
        <div>
          {completion ? (
            <div className="flex items-center justify-center space-x-1">
              <Button
                onClick={() => setCompletion("")}
                disabled={isLoading}
                variant={"ghost"}
                size={"icon"}
              >
                <X className="size-3" />
              </Button>
              <Button
                onClick={() => {
                  editor.commands.insertContent(completion);
                  setCompletion("");
                  editor.commands.removeAllInlineAssistants();
                }}
                disabled={isLoading}
                variant={"ghost"}
                size={"icon"}
              >
                <Check className="size-3" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              variant={"ghost"}
              size={"icon"}
              type="submit"
              className="border border-gray-100"
            >
              {isLoading ? (
                <LoaderCircle className="size-3 animate-spin" />
              ) : (
                <Sparkle className="size-3" />
              )}
            </Button>
          )}
        </div>
      </form>
      <div className="text-gray-500">{completion}</div>
    </NodeViewWrapper>
  );
}
