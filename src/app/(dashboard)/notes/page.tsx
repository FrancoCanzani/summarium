import Link from "next/link";
import { generateNextNoteId } from "@/lib/api/notes";
import { cache } from "react";
import { getCachedUser } from "@/lib/api/auth";
import { getNotes } from "@/lib/api/notes";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

const getCachedNotes = cache(async () => {
  const { data, error } = await getCachedUser();
  if (error || !data || !data.user) {
    redirect("/login");
  }
  return await getNotes(data.user.id);
});

export default async function NotesPage() {
  const notes = await getCachedNotes();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-bold text-gray-800">
          Welcome to Summarium
        </h1>
        <p className="text-gray-600">
          Your personal space for notes and summaries
        </p>
      </header>

      <div className="mb-8 flex justify-center">
        <Link href={`/notes/${await generateNextNoteId()}`}>
          Create New Note
        </Link>
      </div>

      <div className="mb-4">
        <h2 className="mb-6 font-medium text-gray-700">Your Notes</h2>

        {notes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-gray-500">
              You don&apos;t have any notes yet. Create your first one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {notes.map((note) => (
              <Link href={`/notes/${note.id}`} key={note.id} className="group">
                <div className="shadow-2xs hover:shadow-xs hover:shadow-zed-light hover:border-zed-light border-1 h-40 overflow-hidden rounded bg-white p-2">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="truncate font-medium">
                      {note.title || "Untitled"}
                    </h3>
                    {note.updated_at && (
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(note.updated_at), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </div>
                  <div
                    className="overflow-y-scroll text-sm"
                    dangerouslySetInnerHTML={{
                      __html: note.content ?? "",
                    }}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
