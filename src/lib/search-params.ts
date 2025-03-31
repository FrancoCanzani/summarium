import { parseAsString, createLoader } from "nuqs/server";
import { getJournalDate } from "@/lib/utils";

const { urlParam: today } = getJournalDate();

export const journalParams = {
  day: parseAsString.withDefault(today),
};

export const loadJournalParams = createLoader(journalParams);
