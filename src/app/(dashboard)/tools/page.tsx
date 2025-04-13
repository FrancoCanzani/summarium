"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react"; // Use useChat
import { Bot, LoaderCircle, User } from "lucide-react";
import { toast } from "sonner";

export default function ToolsPage() {
  const { messages, input, handleInputChange, handleSubmit, error, isLoading } =
    useChat({
      api: "/api/tools",
      onError: (err) => {
        console.error("Chat hook error:", err);
        toast.error("An error occurred communicating with the AI.");
      },
    });

  console.log(error);
  console.log(messages);

  return (
    <div className="flex h-full flex-col">
      <header className="border-b p-4">
        <h1 className="text-xl font-semibold">AI Task Creator</h1>
        <p className="text-muted-foreground text-sm">
          Ask the AI to create tasks for you (e.g., "Create a task to buy milk
          due tomorrow", "Add two tasks: walk the dog (high priority) and book
          flight").
        </p>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-sm ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <span className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-full">
                  <Bot className="size-4" />
                </span>
              )}

              {m.content && (m.role === "user" || m.role === "assistant") && (
                <div
                  className={`max-w-[80%] rounded-md border px-3 py-2 ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background" // Assistant messages
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              )}

              {m.role === "user" && (
                <span className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full">
                  <User className="size-4" />
                </span>
              )}
            </div>
          ))}

          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start gap-3 text-sm">
                <span className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-full">
                  <Bot className="size-4" />
                </span>
                <div className="bg-background flex items-center rounded-md border px-3 py-2">
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
        </div>
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask AI to create tasks..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              "Send"
            )}
          </Button>
        </form>
        {error && (
          <p className="mt-2 text-sm text-red-500">Error: {error.message}</p>
        )}
      </div>
    </div>
  );
}
