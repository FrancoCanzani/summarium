import { Editor } from "@tiptap/core";

export default function EditorFooter({
  editor,
  isSaved,
}: {
  editor: Editor;
  isSaved: boolean;
}) {
  return (
    <div className="bg-sidebar sticky bottom-0 mx-auto flex w-full items-center justify-between space-x-2 border-t p-1.5 text-xs text-gray-600">
      {isSaved && <span>Saved</span>}
      <div className="flex w-full items-center justify-end space-x-1">
        <p>{editor.storage.characterCount.characters()} characters</p>
        <span>/</span>
        <p>{editor.storage.characterCount.words()} words</p>
      </div>
    </div>
  );
}
