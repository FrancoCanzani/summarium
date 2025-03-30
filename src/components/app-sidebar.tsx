import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { getNotes } from "@/lib/api/notes";
import SidebarNotes from "./sidebar-notes";
import { generateNextNoteId } from "@/lib/api/notes";
import SearchModal from "./search-modal";
import { cache } from "react";

const cachedNotes = cache(async () => {
  return await getNotes();
});

export async function AppSidebar() {
  const notes = await cachedNotes();

  return (
    <Sidebar className="flex h-screen flex-col">
      <SidebarHeader className="gap-0">
        <h2 className="text-zed flex items-center p-2 text-xl font-medium">
          Summarium
        </h2>

        <Link
          href={`/notes/${await generateNextNoteId()}`}
          className="hover:bg-accent p-2"
        >
          New Note
        </Link>
        <SearchModal notes={notes} />
      </SidebarHeader>

      <SidebarContent className="border-y border-dashed">
        <SidebarNotes notes={notes} />
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
