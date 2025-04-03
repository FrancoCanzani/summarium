"use client";

import JournalDayNavigation from "@/components/journal-day-navigation";
import JournalEditor from "@/components/journal-editor";
import { useSearchParams } from "next/navigation";
import {
  useSuspenseQuery,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { Journal } from "@/lib/types";
import { fetchJournal } from "@/lib/fetchers";
import { getQueryClient } from "@/lib/utils";

export default function JournalPage() {
  const searchParams = useSearchParams();
  const queryClient = getQueryClient();

  const day = searchParams.get("day");

  const today = new Date().toISOString().split("T")[0];

  const selectedDay = day || today;

  const { data: journal } = useSuspenseQuery({
    queryKey: [`journal-${day}`],
    queryFn: () => fetchJournal(day!),
  });

  const initialJournal: Journal = journal ?? {
    id: crypto.randomUUID(),
    day: selectedDay,
    content: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="flex h-screen flex-col">
      <JournalDayNavigation />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex-1 overflow-auto">
          <JournalEditor initialJournal={initialJournal} />
        </div>
      </HydrationBoundary>
    </div>
  );
}
