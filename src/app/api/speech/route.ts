import { NextResponse, NextRequest } from 'next/server';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

const MAX_INPUT_LENGTH = 4096; // maximum allowed input length

async function textToSpeech(
  client: OpenAI,
  text: string,
  fileName: string
): Promise<string> {
  try {
    const response = await client.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    const publicDir = path.join(process.cwd(), 'public', 'audio');
    const filePath = path.join(publicDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/audio/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}

function splitText(text: string, maxLength: number): string[] {
  const segments: string[] = [];
  let currentSegment = '';
  const words = text.split(' ');

  for (const word of words) {
    if (currentSegment.length + word.length + 1 <= maxLength) {
      // +1 for the space
      currentSegment += (currentSegment ? ' ' : '') + word;
    } else {
      segments.push(currentSegment);
      currentSegment = word;
    }
  }

  if (currentSegment) {
    segments.push(currentSegment);
  }

  return segments;
}

export async function POST(req: NextRequest) {
  console.log('POST /api/speech');

  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const body = await req.json();
  const { id, text } = body;

  if (!text || text.trim() === '') {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  try {
    const client = new OpenAI();
    const segments = splitText(text, MAX_INPUT_LENGTH);
    const audioUrls: string[] = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const fileName = `speech-${id}-${Date.now()}-${i}.mp3`;
      try {
        const audioUrl = await textToSpeech(client, segment, fileName);
        audioUrls.push(audioUrl);
      } catch (error) {
        console.error(`Error generating speech for segment ${i}:`, error);
        return NextResponse.json(
          { error: `Error generating speech for segment ${i}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ urls: audioUrls }, { status: 200 });
  } catch (error) {
    console.error('Error generating speech:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
