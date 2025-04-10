import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { copyToClipboard, formatTextBeforeInsertion } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/core";
import { LoaderCircle, MoreHorizontal, SendHorizonal } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BotMessageSquare } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AiAssistantSheet({ editor }: { editor: Editor }) {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat(
    {},
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const applyAIResponse = useCallback(
    (content: string, mode: "insert" | "replace" | "append") => {
      //   const formattedContent = formatTextBeforeInsertion(content);
      switch (mode) {
        case "insert":
          editor.commands.insertContent(content);
          break;
        case "replace":
          editor.chain().deleteSelection().insertContent(content).run();
          break;
        case "append":
          editor.commands.insertContentAt(
            editor.state.doc.content.size,
            content,
          );
          break;
      }
    },
    [editor],
  );

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className={cn("flex size-6 md:hidden")}
            >
              <BotMessageSquare className="size-4" />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <span>Assistant</span>
          <span className="text-gray-11 ml-1 text-xs">(cmd + a)</span>
        </TooltipContent>
      </Tooltip>

      <SheetContent side="bottom" className="h-[80%] w-full">
        <SheetHeader className="bg-background flex h-12 w-full flex-row items-center justify-between space-x-2 border-b px-2 py-2.5 pr-10">
          <SheetTitle className="font-medium">AI Assistant</SheetTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            // onClick={clearMessages}
          >
            Clear
          </Button>
        </SheetHeader>
        <div className="flex h-full w-full flex-col pb-2 text-sm">
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto p-2">
              {messages.length > 0 ? (
                <div className="space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[95%] rounded-md px-3 py-1.5",
                          message.role === "user"
                            ? "bg-primary/90 text-primary-foreground dark:bg-primary/20"
                            : "bg-muted",
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <p className="whitespace-pre-wrap text-sm">
                            {message.content}
                          </p>
                          {message.role === "assistant" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2 h-auto p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                //   onClick={() => copyToClipboard(message.content)}
                                >
                                  Copy
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    applyAIResponse(message.content, "insert")
                                  }
                                >
                                  Insert at cursor
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    applyAIResponse(message.content, "replace")
                                  }
                                >
                                  Replace selection
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    applyAIResponse(message.content, "append")
                                  }
                                >
                                  Append to note
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <p className="text-muted-foreground text-balance text-center text-sm">
                    No AI-generated content yet. Enter a prompt below.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3 border-t px-2 pb-1 pt-3">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask the AI assistant..."
              className="flex-1 bg-transparent outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button
              disabled={input.length === 0}
              onClick={() => handleSubmit()}
              className={cn("pr-2", { "opacity-70": input.length === 0 })}
            >
              {status != "ready" ? (
                <LoaderCircle className="animate-spin" size={17} />
              ) : (
                <SendHorizonal size={17} />
              )}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
