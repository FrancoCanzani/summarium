import JournalDayNavigation from "@/components/journal-day-navigation";
import JournalEditor from "@/components/journal-editor";
import { getJournalByDay } from "@/lib/api/journal";
import { Journal } from "@/lib/types";

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  const { day } = await searchParams;

  const selectedDay = day || new Date().toISOString().split("T")[0];

  try {
    const journal = await getJournalByDay(selectedDay);

    const initialJournal: Journal = journal ?? {
      id: crypto.randomUUID(),
      day: selectedDay,
      content: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return (
      <>
        <JournalDayNavigation />
        <JournalEditor initialJournal={initialJournal} />
      </>
    );
  } catch (error) {
    console.error("Error fetching journal:", error);
    return <div>Error loading journal</div>;
  }
}
