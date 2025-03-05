import { Editor } from '@tiptap/core';

export default function EditorFooter({ editor }: { editor: Editor }) {
  return (
    <div className='flex items-center p-3 justify-end w-full text-xs text-gray-600 space-x-2'>
      <p>{editor.storage.characterCount.characters()} characters</p>
      <span>/</span>
      <p>{editor.storage.characterCount.words()} words</p>
    </div>
  );
}
