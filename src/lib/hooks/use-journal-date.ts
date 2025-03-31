"use client";

import { getJournalDate } from "@/lib/utils";
import { useQueryState, parseAsString } from "nuqs";

export function useJournalDate() {
  const { urlParam: today } = getJournalDate();

  const [day, setDay] = useQueryState("day", parseAsString.withDefault(today));

  const formattedDate = getJournalDate(day).display;

  return {
    currentDay: day,
    setDay,
    today,
    isToday: day === today,
    formattedDate,
  };
}
