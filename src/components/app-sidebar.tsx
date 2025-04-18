import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { getCachedUser } from "@/lib/api/auth";
import { generateNextNoteId, getNotes } from "@/lib/api/notes";
import { fetchJournal } from "@/lib/fetchers";
import { QueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cache } from "react";
import SearchModal from "./search-modal";
import SidebarNotes from "./sidebar-notes";

export const cachedNotes = cache(async () => {
  const { data, error } = await getCachedUser();

  if (error || !data || !data.user) {
    redirect("/login");
  }
  return await getNotes(data.user.id);
});

export async function AppSidebar() {
  const notes = await cachedNotes();

  const queryClient = new QueryClient();

  const today = new Date().toISOString().split("T")[0];

  void queryClient.prefetchQuery({
    queryKey: ["journal"],
    queryFn: async () => await fetchJournal(today),
  });

  return (
    <Sidebar className="flex h-screen flex-col text-sm">
      <SidebarHeader className="gap-0">
        <h2 className="text-zed flex items-center p-2 text-lg font-medium">
          Summarium
        </h2>
        <Link href={`/home`} className="hover:bg-accent rounded-sm p-1.5">
          Home
        </Link>
        <Link
          href={`/notes/${await generateNextNoteId()}`}
          className="hover:bg-accent rounded-sm p-1.5"
        >
          New Note
        </Link>
        <SearchModal notes={notes} />
      </SidebarHeader>

      <SidebarContent className="border-y border-dashed">
        <SidebarNotes notes={notes} />
      </SidebarContent>

      <SidebarFooter className="gap-0">
        <Link
          href={`/journal?day=${today}`}
          className="hover:bg-accent rounded-sm p-1.5"
        >
          Journal
        </Link>
        <Link href={"/tasks"} className="hover:bg-accent rounded-sm p-1.5">
          Tasks
        </Link>
        <Link href={"/docs"} className="hover:bg-accent rounded-sm p-1.5">
          Docs
        </Link>
        <Link href={"/settings"} className="hover:bg-accent rounded-sm p-1.5">
          Settings
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
