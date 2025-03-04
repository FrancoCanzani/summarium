'use server';

import OpenAI from 'openai';

const openai = new OpenAI();

export async function transcribeAudioFile(formData: FormData) {
  try {
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return { error: 'No audio file provided' };
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'text',
    });

    console.log('Transcription:', transcription);
    return { text: transcription };
  } catch (error) {
    console.error('Transcription error:', error);
    return { error: 'Failed to transcribe audio' };
  }
}
