import Link from "next/link";
import { generateNextNoteId } from "@/lib/api/notes";

export default async function NotesPage() {
  return (
    <>
      <div className="flex h-full flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-2xl font-bold">Welcome to Summarium</h1>
        <p className="mb-6">Select a note from or create a new one</p>
        <Link
          href={`/notes/${await generateNextNoteId()}`}
          className="px-4 py-2 decoration-dashed underline-offset-4 hover:underline"
        >
          Create New Note
        </Link>
      </div>
    </>
  );
}
