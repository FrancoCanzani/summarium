import { createTask } from "@/lib/actions";
import { MultiTaskSchema, SingleTaskSchema } from "@/lib/schemas";
import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

type SingleTaskData = z.infer<typeof SingleTaskSchema>;

export const maxDuration = 30;

async function executeCreateTasks({ tasks }: { tasks: SingleTaskData[] }) {
  console.log("Server executing createTasks tool:", tasks);
  let createdCount = 0;
  let errorCount = 0;

  const creationPromises = tasks.map(async (taskData) => {
    const formData = new FormData();
    formData.append("title", taskData.title);

    formData.append("description", taskData.description || "No Description");
    formData.append("date", taskData.date || "");
    formData.append("status", taskData.status || "backlog");
    formData.append("priority", taskData.priority || "no-priority");
    try {
      const result = await createTask(formData);
      if (result.success) {
        createdCount++;
      } else {
        console.error(
          "Failed to create task via server action:",
          taskData.title,
          result.errors,
        );
        errorCount++;
      }
    } catch (error) {
      console.error("Error calling createTask action:", error);
      errorCount++;
    }
  });

  await Promise.all(creationPromises);

  const resultMessage = `Created ${createdCount} tasks. Failed to create ${errorCount} tasks.`;
  console.log("Tool execution result:", resultMessage);
  return resultMessage;
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a helpful assistant designed to create tasks within the Summarium application.
             When a user asks you to create tasks, use the 'createMultipleTasks' tool.
             Extract the title, and optionally description, priority, and due date for each task.
             Ask for clarification if the request is ambiguous.
             You don't need explicit confirmation before calling the tool, just call it when requested.
             After the tool executes, briefly confirm the outcome based on the tool result.`,
    messages,
    tools: {
      createMultipleTasks: tool({
        description:
          "Create one or more tasks based on the user's request. Use this tool whenever the user asks to create tasks.",
        parameters: MultiTaskSchema,
        execute: executeCreateTasks,
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
