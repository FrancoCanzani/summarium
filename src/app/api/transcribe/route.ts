import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI();

export async function POST(request: Request) {
  const formData = await request.formData();
  const audioFile = formData.get("audio") as File;

  if (!audioFile) {
    return NextResponse.json(
      { error: "No audio file provided" },
      { status: 400 },
    );
  }

  try {
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempFilePath = `/tmp/${audioFile.name}`;
    await fs.promises.writeFile(tempFilePath, buffer);

    const stream = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "gpt-4o-mini-transcribe",
      response_format: "text",
      stream: true,
    });

    fs.promises.unlink(tempFilePath).catch(console.error);

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === "transcript.text.delta" && event.delta) {
              controller.enqueue(encoder.encode(event.delta));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(readableStream);
  } catch (error) {
    console.error("Error during transcription:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 },
    );
  }
}
