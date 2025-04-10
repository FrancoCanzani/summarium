"use client";

import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Note } from "@/lib/types";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function SidebarNotes({ notes }: { notes: Note[] }) {
  const { id } = useParams();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="thin-scrollbar space-y-0.5">
        {notes?.map((item) => (
          <Link
            href={`/notes/${item.id}`}
            prefetch={true}
            key={item.id}
            className={cn(
              "hover:text-zed flex w-full flex-col items-start justify-between gap-1.5 overflow-hidden rounded-sm px-2 py-1.5 text-xs",
              id === item.id && "text-zed",
            )}
          >
            <div className="flex w-full items-center justify-between gap-1">
              <span className="w-full truncate text-start">
                {item.title || "Untitled"}
              </span>
              {id === item.id && <ChevronLeft className="size-3" />}
            </div>
            {item.updated_at && (
              <span className="w-full text-end text-[10px] text-gray-400">
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
