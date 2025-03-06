import Editor from '@/components/editor';
import { createClient } from '@/lib/supabase/server';
import { fetchNote } from '@/lib/api/notes';
import { randomUUID } from 'crypto';

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  let note = await fetchNote(id, user.id);

  if (!note) {
    note = {
      id: randomUUID(),
      user_id: user.id,
      title: '',
      content: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return (
    <div>
      <Editor initialNote={note} />
    </div>
  );
}
