import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(request: Request) {
  const formData = await request.formData();

  const audioFile = formData.get('audio') as File;

  if (!audioFile) {
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 }); // Return a NextResponse with an error status
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'text',
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = transcription.split(' ');
        for (const word of words) {
          const chunk = encoder.encode(word + ' ');
          controller.enqueue(chunk);
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        controller.close();
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error("Error during transcription:", error);
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 }); // Return a NextResponse for errors
  }
}
