"use client";

import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarNotesSkeleton() {
  const skeletonItems = Array.from({ length: 5 }, (_, i) => i);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="thin-scrollbar">
        {skeletonItems.map((index) => (
          <div
            key={index}
            className="flex w-full flex-col items-center justify-between gap-1.5 overflow-hidden px-2 py-1.5"
          >
            <Skeleton className="h-4 w-full rounded-none" />
            <Skeleton className="ml-auto h-3 w-2/3 rounded-none" />
          </div>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
