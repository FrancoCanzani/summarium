import JournalDayNavigation from "@/components/journal-day-navigation";
import JournalEditor from "@/components/journal-editor";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchJournal } from "@/lib/fetchers";

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const day = (await searchParams).day;
  const queryClient = new QueryClient();
  const today = new Date().toISOString().split("T")[0];
  const selectedDay = day || today;

  void queryClient.prefetchQuery({
    queryKey: ["journal", selectedDay],
    queryFn: async () => await fetchJournal(selectedDay),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-screen flex-col">
        <JournalDayNavigation />
        <div className="flex-1 overflow-auto">
          <JournalEditor />
        </div>
      </div>
    </HydrationBoundary>
  );
}
