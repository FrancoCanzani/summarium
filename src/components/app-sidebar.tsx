import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import SearchModal from "./search-modal";
import { createClient } from "@/lib/supabase/server";
import { Note } from "@/lib/types";
import { fetchNotes } from "@/lib/api/notes";
import SidebarNotes from "./sidebar-notes";

export async function AppSidebar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let notes: Note[] = [];

  if (user) {
    notes = await fetchNotes(user.id);
  }

  return (
    <Sidebar className="flex flex-col h-screen">
      <SidebarHeader className="gap-0">
        <h2 className="p-2 font-medium text-xl text-zed flex items-center">
          Summarium
        </h2>

        <Link
          href={`/notes/${crypto.randomUUID()}`}
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
        <Link href={"/docs"} className="p-2 hover:bg-accent font-medium">
          Docs
        </Link>

        <Link href={"/settings"} className="p-2 hover:bg-accent font-medium">
          Settings
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
