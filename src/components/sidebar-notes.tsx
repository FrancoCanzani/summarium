"use client";

import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Note } from "@/lib/types";
import { useParams } from "next/navigation";
import { use } from "react";

export default function SidebarNotes({
  notesPromise,
}: {
  notesPromise: Promise<Note[]>;
}) {
  const { id } = useParams();
  const notes = use(notesPromise);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="thin-scrollbar">
        {notes &&
          notes.map((item) => (
            <Link
              href={`/notes/${item.id}`}
              key={item.id}
              className={cn(
                "hover:bg-zed-light flex w-full flex-col items-center justify-between gap-1.5 overflow-hidden px-2 py-1.5 text-xs",
                id === item.id
                  ? "bg-zed-light border-l-zed border-l-2 font-medium"
                  : "bg-sidebar",
              )}
            >
              <span className="w-full truncate text-start">
                {item.title ?? "Untitled"}
              </span>
              {item.updated_at && (
                <span className="w-full text-end text-xs text-gray-400">
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
