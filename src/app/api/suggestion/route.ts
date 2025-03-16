import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const maxDuration = 30;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get('query');

  if (!query || query.trim() === '') {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  const client = new OpenAI();

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a highly skilled text editor assistant. Based on the following text: '${query}', provide a clear, concise, and contextually relevant continuation to autocomplete the text. Respond with the continuation only, without any additional explanation or commentary.`,
        },
      ],
    });

    const suggestion = completion.choices[0]?.message?.content;

    if (!suggestion) {
      return NextResponse.json(
        { error: 'No suggestion generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ text: suggestion }, { status: 200 });
  } catch (error) {
    console.error('Error generating suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestion' },
      { status: 500 }
    );
  }
}
