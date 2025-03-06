'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { extensions } from '@/lib/extensions';
import EditorFooter from './editor-footer';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upsertNote } from '@/lib/api/notes';
import { toast } from 'sonner';
import { RightSidebar } from './right-sidebar';
import AiAssistant from './ai-assistant';
import { Toolbar } from './toolbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarTrigger } from './ui/sidebar';
import AudioTranscriber from './audio-transcriber';
import { useAuth } from '@/lib/hooks/use-auth';
import { redirect } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Note } from '@/lib/types';

export default function Editor({ initialNote }: { initialNote: Note }) {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const { loading, user } = useAuth();
  const { id } = useParams();

  if (!id) redirect('/');

  const [title, setTitle] = useState(initialNote.title);
  const [content, setContent] = useState(initialNote.content);
  const [isSaved, setIsSaved] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showTranscriber, setShowTranscriber] = useState(false);

  if (!user && !loading) redirect('/login');

  const upsertNoteMutation = useMutation({
    mutationFn: upsertNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsSaved(true);
    },
    onError: () => toast.error('There was an error saving your note'),
  });

  const handleDebouncedTitleChange = useDebouncedCallback((value: string) => {
    if (!user) return;

    upsertNoteMutation.mutate({
      id: id?.toString(),
      user_id: user?.id,
      title: value,
      content: content,
      updated_at: new Date().toISOString(),
    });
  }, 1000);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    handleDebouncedTitleChange(value);
  };

  const handleDebouncedContentChange = useDebouncedCallback((value: string) => {
    if (!user) return;

    upsertNoteMutation.mutate({
      id: id?.toString(),
      user_id: user?.id,
      title: title,
      content: value,
      updated_at: new Date().toISOString(),
    });
  }, 1000);

  const handleContentChange = (value: string) => {
    setContent(value);
    handleDebouncedContentChange(value);
  };

  const editor = useEditor({
    extensions: extensions,
    content: content,
    onUpdate: ({ editor }) => {
      handleContentChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className='flex h-svh w-full'>
      <div className='flex relative h-svh flex-1 flex-col mx-auto max-w-4xl'>
        <input
          className='border-none outline-none text-xl py-2.5 h-12 px-3 w-full'
          placeholder='Title'
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
        />
        <div className='flex items-center justify-start space-x-2 px-3'>
          {isMobile && <SidebarTrigger />}
          <Toolbar
            editor={editor}
            setShowAssistant={setShowAssistant}
            showAssistant={showAssistant}
            setShowTranscriber={setShowTranscriber}
            showTranscriber={showTranscriber}
          />
        </div>
        <div className='flex flex-1 overflow-hidden relative'>
          <EditorContent
            editor={editor}
            className='py-2.5 my-0 px-3 min-w-full h-full overflow-y-auto'
          />
          <AudioTranscriber
            editor={editor}
            setShowTranscriber={setShowTranscriber}
            showTranscriber={showTranscriber}
          />
        </div>

        <EditorFooter editor={editor} isSaved={isSaved} />
      </div>

      <RightSidebar open={showAssistant} onOpenChange={setShowAssistant}>
        <AiAssistant editor={editor} />
      </RightSidebar>
    </div>
  );
}
