import JournalDayNavigation from "@/components/journal-day-navigation";
import JournalEditor from "@/components/journal-editor";
import { getJournalByDay } from "@/lib/api/journal";
import { Journal } from "@/lib/types";
import { validateDateParam } from "@/lib/utils";

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  const { day } = await searchParams;

  const today = new Date().toISOString().split("T")[0];

  validateDateParam(day);

  const selectedDay = day || today;

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
      <div className="flex h-screen flex-col">
        <JournalDayNavigation />
        <div className="flex-1 overflow-auto">
          <JournalEditor initialJournal={initialJournal} />
        </div>
      </div>
    );
  } catch {
    return <div>Error loading journal</div>;
  }
}
