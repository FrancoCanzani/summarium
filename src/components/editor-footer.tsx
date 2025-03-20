import { Editor } from "@tiptap/core";

export default function EditorFooter({
  editor,
  isSaved,
}: {
  editor: Editor;
  isSaved: boolean;
}) {
  return (
    <div className="flex sticky bg-sidebar bottom-0 items-center p-1.5 border-t justify-between mx-auto w-full text-xs text-gray-600 space-x-2">
      {isSaved && <span>Saved</span>}
      <div className="flex items-center justify-end w-full">
        <p>{editor.storage.characterCount.characters()} characters</p>
        <span>/</span>
        <p>{editor.storage.characterCount.words()} words</p>
      </div>
    </div>
  );
}
