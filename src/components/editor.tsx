'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { extensions } from '@/lib/extensions';
import { Toolbar } from './toolbar';
import EditorFooter from './editor-footer';
import { SidebarTrigger } from './ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useMutation } from '@tanstack/react-query';

export default function Editor() {
  const isMobile = useIsMobile();
  const [title, setTitle] = useState(''); 
  const [content, setContent] = useState(''); 

  const editor = useEditor({
    extensions: extensions,
    content: content,
    onUpdate: ({ editor }) => { 
      handleDebouncedContentChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const handleDebouncedTitleChange = useDebouncedCallback(
    (value) => {
      setTitle(value);
    },
    1000
  );

  const handleDebouncedContentChange = useDebouncedCallback(
    (value) => {
      setContent(value);
      console.log(content);
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