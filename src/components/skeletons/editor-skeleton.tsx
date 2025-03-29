"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function EditorSkeleton() {
  return (
    <div className="flex min-h-svh w-full">
      <div className="relative mx-auto flex min-h-svh flex-1 flex-col">
        {/* Header */}
        <div className="flex w-full items-start justify-between py-3 pl-1 pr-2">
          <Skeleton className="h-3 w-24 rounded-none" />
          <div className="flex items-center space-x-1.5 px-2">
            <Skeleton className="h-4 w-4 rounded-lg" />
            <Skeleton className="h-4 w-4 rounded-lg" />
            <Skeleton className="h-4 w-4 rounded-lg" />
            <Skeleton className="h-4 w-4 rounded-lg" />
            <Skeleton className="h-4 w-4 rounded-lg" />
          </div>
        </div>

        {/* Editor Content Skeleton */}
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col space-y-5 px-3 py-6">
          {/* Title Input Skeleton */}
          <Skeleton className="h-4 w-1/3 rounded-none" />

          {/* Editor Content Skeleton */}
          <div className="flex-1 space-y-3">
            <Skeleton className="h-3 w-full rounded-none" />
            <Skeleton className="h-3 w-11/12 rounded-none" />
            <Skeleton className="h-3 w-10/12 rounded-none" />
            <Skeleton className="h-3 w-full rounded-none" />
            <Skeleton className="h-3 w-9/12 rounded-none" />
            <Skeleton className="h-3 w-full rounded-none" />
            <Skeleton className="h-3 w-8/12 rounded-none" />
            <Skeleton className="h-3 w-10/12 rounded-none" />
            <Skeleton className="h-3 w-full rounded-none" />
            <Skeleton className="h-3 w-7/12 rounded-none" />
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="flex w-full items-center justify-between space-x-2 p-2">
          <Skeleton className="h-2 w-16 rounded-none" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-2 w-20 rounded-none" />
            <Skeleton className="h-2 w-20 rounded-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
