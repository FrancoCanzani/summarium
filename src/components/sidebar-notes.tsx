"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {  preloadNote } from "@/lib/api/notes";
import { useAuth } from "@/lib/context/auth-context";
import { Note } from "@/lib/types";
import { useParams } from "next/navigation";

export default function SidebarNotes({notes}:{notes: Note[]}) {
  const {user} = useAuth();
  const {id} = useParams()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="thin-scrollbar">
        {notes &&
          notes.map((item) => (
            <Link
              href={`/notes/${item.id}`}
              key={item.id}
              onMouseEnter={() => {
                if (user) {
                  preloadNote(user.id, item.id);
                }
              }}
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
  );
}
