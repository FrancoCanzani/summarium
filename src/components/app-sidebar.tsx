"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { fetchNotes } from "@/lib/api/notes";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import SearchModal from "./search-modal";

export function AppSidebar() {
  const { user } = useAuth();
  const { id } = useParams();
  const { data: notes } = useQuery({
    queryKey: ["notes"],
    queryFn: () => fetchNotes(user!.id),
  });

  return (
    <Sidebar className="flex flex-col h-screen">
      <div className="h-12 flex items-center">
        <h2 className="p-2 font-medium text-2xl">Summarium</h2>
      </div>

      <div className="h-12 border-y font-medium text-xl flex w-full">
        <Link
          href={`/notes/${crypto.randomUUID()}`}
          className="w-1/2 p-2 text-center h-full border-r hover:bg-accent"
        >
          New Note
        </Link>
        <SearchModal notes={notes} />
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto divide-y divide-dashed thin-scrollbar">
          {notes &&
            notes.map((item) => (
              <Link
                href={`/notes/${item.id}`}
                key={item.id}
                className={cn(
                  "flex w-full flex-col items-center gap-1.5 overflow-hidden p-1.5 px-2 justify-between text-xs hover:bg-sidebar-accent",
                  id === item.id
                    ? "bg-sidebar-accent font-medium"
                    : "bg-sidebar",
                )}
              >
                <span className="truncate w-full text-start">
                  {item.title ?? "Untitled"}
                </span>
                {item.updated_at && (
                  <span className="text-xs text-end w-full text-gray-400">
                    {formatDistanceToNow(new Date(item.updated_at), {
                      addSuffix: true,
                    })}
                  </span>
                )}
              </Link>
            ))}
        </div>
      </div>

      {/* Fixed docs link - Box 3 */}
      <Link
        href={"/docs"}
        className="h-12 p-2 hover:bg-accent font-medium text-xl border-y flex items-center"
      >
        Docs
      </Link>

      {/* Fixed settings link - Box 4 */}
      <Link
        href={"/settings"}
        className="h-12 p-2 hover:bg-accent font-medium text-xl border-b flex items-center"
      >
        Settings
      </Link>
    </Sidebar>
  );
}
