import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import SearchModal from "./search-modal";
import { fetchNotes } from "@/lib/api/notes";
import SidebarNotes from "./sidebar-notes";
import { Suspense } from "react";
import SidebarNotesSkeleton from "./skeletons/sidebar-notes-skeleton";
import SidebarSearchSkeleton from "./skeletons/sidebar-search-skeleton";

export async function AppSidebar() {
  const notes = fetchNotes();

  return (
    <Sidebar className="flex h-screen flex-col">
      <SidebarHeader className="gap-0">
        <h2 className="text-zed flex items-center p-2 text-xl font-medium">
          Summarium
        </h2>

        <Link
          href={`/notes/${crypto.randomUUID()}`}
          className="hover:bg-accent p-2"
        >
          New Note
        </Link>
        <Suspense fallback={<SidebarSearchSkeleton />}>
          <SearchModal notesPromise={notes} />
        </Suspense>
      </SidebarHeader>

      <SidebarContent className="border-y border-dashed">
        <Suspense fallback={<SidebarNotesSkeleton />}>
          <SidebarNotes notesPromise={notes} />
        </Suspense>
      </SidebarContent>

      <SidebarFooter className="gap-0">
        <Link href={"/docs"} className="hover:bg-accent p-2 font-medium">
          Docs
        </Link>

        <Link href={"/settings"} className="hover:bg-accent p-2 font-medium">
          Settings
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
