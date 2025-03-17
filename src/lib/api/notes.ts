import { Note } from '../types';
import { createClient } from '../supabase/client';
import { randomUUID } from 'crypto';

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

export async function fetchOrCreateNote(
  id: string,
  userId: string
): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .select()
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    return data as Note;
  }

  const now = new Date().toISOString();
  const newNote: Note = {
    id: randomUUID(),
    user_id: userId,
    title: '',
    content: '',
    created_at: now,
    updated_at: now,
  };

  return await upsertNote(newNote);
}
