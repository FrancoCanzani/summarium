import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    prompt: `You are a helpful AI assistant that helps me with my writing. I need help with the following prompt: ${prompt}. Please provide a response that is short and concise but helpfull.`,
  });

  return result.toDataStreamResponse();
}
