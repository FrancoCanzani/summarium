import Link from "next/link";
import { randomUUID } from "crypto";

export default async function NotesPage() {

  return (
      <>
        <div className="text-center h-full flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Summarium</h1>
          <p className="mb-6">Select a note from the sidebar or create a new one</p>
          <Link
            href={`/notes/${randomUUID()}`}
            className="px-4 py-2 hover:underline"
          >
            Create New Note
          </Link>
        </div>
      </>
  );
}
