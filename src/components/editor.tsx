'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { extensions } from '@/lib/extensions';
import { Toolbar } from './toolbar';
import EditorFooter from './editor-footer';

export default function Editor() {
  const editor = useEditor({
    extensions: extensions,
    content: '<p>Hello, Tiptap!</p>',
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className='max-w-4xl flex flex-col w-full mx-auto h-screen'>
      <header className='pt-5 px-3'>
        <input
          className='border-none outline-none text-xl'
          placeholder='Title'
        />
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
