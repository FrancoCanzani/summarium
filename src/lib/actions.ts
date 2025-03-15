'use server';

import OpenAI from 'openai';
import { createClient } from './supabase/server';

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

export async function deleteNote(
  id: string,
  userId: string
): Promise<{ id: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select('id');

  if (error) {
    throw new Error(error.message);
  }

  return { id: id };
}
