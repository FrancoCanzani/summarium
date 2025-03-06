import { Note } from '../types';
import { createClient } from '../supabase/client';

const supabase = createClient();

export async function upsertNote(note: Note): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .upsert(note, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Note;
}

export async function fetchNotes(userId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select()
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Note[];
}

export async function fetchNote(
  id: string,
  userId: string
): Promise<Note | null> {
  const { data, error } = await supabase
    .from('notes')
    .select()
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (!data) {
    return null;
  }

  if (error) {
    throw new Error(error.message);
  }

  return data as Note;
}
