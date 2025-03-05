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
    <div className='max-w-5xl px-3 flex-col flex py-8 w-full mx-auto min-h-screen'>
      <input className='border-none outline-none text-xl' placeholder='Title' />
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className='flex-1 prose min-w-full' />
      <EditorFooter editor={editor} />
    </div>
  );
}
