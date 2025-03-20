"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
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
        <SidebarGroup>
          <SidebarGroupContent className="thin-scrollbar">
            {notes &&
              notes.map((item) => (
                <Link
                  href={`/notes/${item.id}`}
                  key={item.id}
                  className={cn(
                    "flex w-full flex-col items-center gap-1.5 overflow-hidden py-1.5 px-2 justify-between text-xs hover:bg-zed-light",
                    id === item.id
                      ? "bg-zed-light font-medium border-l-2 border-l-zed"
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
          </SidebarGroupContent>
        </SidebarGroup>
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
