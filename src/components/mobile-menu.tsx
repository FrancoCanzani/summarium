import { fetchJournal } from "@/lib/fetchers";
import { QueryClient } from "@tanstack/react-query";
import { Home, Notebook, Settings, SquareCheckBig } from "lucide-react";
import Link from "next/link";
import { cachedNotes } from "./app-sidebar";
import NotesSheet from "./notes-sheet";

export default async function MobileMenu() {
  const notes = await cachedNotes();

  const queryClient = new QueryClient();

  const today = new Date().toISOString().split("T")[0];

  void queryClient.prefetchQuery({
    queryKey: ["journal", today],
    queryFn: async () => await fetchJournal(today),
  });

  return (
    <nav className="bg-background shadow-2xs fixed bottom-0 left-0 right-0 z-50 grid h-10 w-full grid-cols-5 items-center gap-1.5 border md:hidden">
      <Link
        className="hover:bg-muted group flex h-10 flex-1 items-center justify-center rounded-sm px-3 py-1.5"
        href="/home"
      >
        <Home className="size-4.5" />
      </Link>
      <Link
        className="hover:bg-muted group flex h-10 flex-1 items-center justify-center rounded-sm px-3 py-1.5"
        href="/tasks"
      >
        <SquareCheckBig className="size-4.5" />
      </Link>
      <NotesSheet notes={notes} />
      <Link
        prefetch={true}
        className="hover:bg-muted group flex h-10 flex-1 items-center justify-center rounded-sm px-3 py-1.5"
        href={`/journal?day=${today}`}
      >
        <Notebook className="size-4.5" />
      </Link>
      <Link
        className="hover:bg-muted group flex h-10 flex-1 items-center justify-center rounded-sm px-3 py-1.5"
        href="/settings"
      >
        <Settings className="size-4.5" />
      </Link>
    </nav>
  );
}
