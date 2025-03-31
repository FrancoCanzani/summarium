import JournalDayNavigation from "@/components/journal-day-navigation";
import JournalEditor from "@/components/journal-editor";
import { getJournalByDay } from "@/lib/api/journal";
import { Journal } from "@/lib/types";

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;

  const day = date || new Date().toISOString().split("T")[0];

  console.log(day);

  try {
    const journal = await getJournalByDay(day);

    console.log(journal);

    const initialJournal: Journal = journal ?? {
      id: crypto.randomUUID(),
      day: day,
      content: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return (
      <main className="h-full w-full">
        <JournalDayNavigation />
        <JournalEditor initialJournal={initialJournal} />
      </main>
    );
  } catch (error) {
    console.error("Error fetching journal:", error);
    return <div>Error loading journal</div>;
  }
}
