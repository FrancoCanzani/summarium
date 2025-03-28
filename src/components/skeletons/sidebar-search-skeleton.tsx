"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarSearchSkeleton() {
  return (
    <div className="h-10 p-2 w-full flex items-center justify-start">
      <Skeleton className="w-1/4 rounded-none p-1" />
    </div>
  );
}
