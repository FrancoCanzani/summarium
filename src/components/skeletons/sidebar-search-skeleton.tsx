"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarSearchSkeleton() {
  return (
    <div className="flex h-10 w-full items-center justify-start p-2">
      <Skeleton className="w-1/4 rounded-none p-1" />
    </div>
  );
}
