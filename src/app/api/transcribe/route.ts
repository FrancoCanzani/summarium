import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(request: Request) {
  const formData = await request.formData();

  const audioFile = formData.get('audio') as File;

  if (!audioFile) {
    return { error: 'No audio file provided' };
  }

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
}
