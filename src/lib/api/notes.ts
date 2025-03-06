import { Note } from '../types';
import { createClient } from '../supabase/client';

const supabase = createClient();

export async function upsertNote(note: Note): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .upsert(note)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Note;
}
