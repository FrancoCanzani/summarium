'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { extensions } from '@/lib/extensions';
import { Toolbar } from './toolbar';
import EditorFooter from './editor-footer';
import { SidebarTrigger } from './ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNote } from '@/lib/api/notes';
import { toast } from 'sonner';

export default function Editor() {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient()

  const [title, setTitle] = useState(''); 
  const [content, setContent] = useState(''); 
  const [saved, setIsSaved] = useState(false); 

  const editor = useEditor({
    extensions: extensions,
    content: content,
    onUpdate: ({ editor }) => { 
      handleDebouncedContentChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const noteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      setIsSaved(true)
    },
    onError: () => toast.error("There was an error saving your note"),    
  })

  const handleDebouncedTitleChange = useDebouncedCallback(
    (value) => {
      setTitle(value);
      noteMutation.mutate({id: 1; title: value; content: content})
    },
    1000
  );

  const handleDebouncedContentChange = useDebouncedCallback(
    (value) => {
      setContent(value);
      noteMutation.mutate({id: 1; title: title; content: value})
    },
    1000
  );

  if (!editor) return null;

  return (
    <div className='max-w-4xl flex flex-col w-full mx-auto h-screen'>
      <header className='pt-5 px-3 overflow-hidden'>
        <div className='flex items-center justify-start space-x-2'>
          {isMobile && <SidebarTrigger />}
          <input
            className='border-none outline-none text-xl'
            placeholder='Title'
            value={title}
            onChange={handleDebouncedTitleChange}
          />
        </div>
        <Toolbar editor={editor} />
      </header>
      <div className='flex-1 w-full overflow-hidden'>
        <EditorContent
          editor={editor}
          className='prose my-0 px-3 min-w-full h-full overflow-y-auto'
        />
      </div>
      <EditorFooter editor={editor} />
    </div>
  );
}