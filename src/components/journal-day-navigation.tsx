"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchJournal } from "@/lib/fetchers";
import { validateDateParam } from "@/lib/utils";
import { QueryClient } from "@tanstack/react-query";
import { addDays, format, parse } from "date-fns";
import { CalendarSync, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import ButtonWithTooltip from "./ui/button-with-tooltip";

export default function JournalDayNavigation() {
  const queryClient = new QueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const day = searchParams.get("day");
  const today = new Date().toISOString().split("T")[0];

  validateDateParam(day);
  const selectedDay = day || today;

  const handleDayChange = (offset: number) => {
    const currentDate = parseDate(selectedDay);
    const newDate = addDays(currentDate, offset);
    const formattedDate = format(newDate, "yyyy-MM-dd");
    router.push(`/journal?day=${formattedDate}`);
  };

  const handleGoToToday = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    router.push(`/journal?day=${today}`);
  };

  const prefetchJournalData = async (date: string) => {
    const formattedDate = format(parseDate(date), "yyyy-MM-dd");
    await queryClient.prefetchQuery({
      queryKey: [`journal-${formattedDate}`],
      queryFn: async () => await fetchJournal(formattedDate),
    });
  };

  const prefetchPreviousDay = async () => {
    const currentDate = parseDate(selectedDay);
    const previousDate = addDays(currentDate, -1);
    const formattedDate = format(previousDate, "yyyy-MM-dd");
    await prefetchJournalData(formattedDate);
  };

  const prefetchNextDay = async () => {
    const currentDate = parseDate(selectedDay);
    const nextDate = addDays(currentDate, 1);
    const formattedDate = format(nextDate, "yyyy-MM-dd");
    await prefetchJournalData(formattedDate);
  };

  const prefetchToday = async () => {
    const today = format(new Date(), "yyyy-MM-dd");
    await prefetchJournalData(today);
  };

  return (
    <header className="bg-background sticky top-0 z-10 w-full px-2 pt-4">
      <div className="mx-auto flex max-w-5xl flex-row items-center justify-between">
        <JournalDatePicker selectedDay={selectedDay} />
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant={"outline"}
            size={"xs"}
            onClick={() => handleDayChange(-1)}
            className="rounded-sm"
            onMouseEnter={prefetchPreviousDay}
            onFocus={prefetchPreviousDay}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant={"outline"}
            size={"xs"}
            onClick={() => handleDayChange(1)}
            className="rounded-sm"
            onMouseEnter={prefetchNextDay}
            onFocus={prefetchNextDay}
          >
            <ChevronRight className="size-4" />
          </Button>
          <ButtonWithTooltip
            tooltipText="Today"
            variant={"outline"}
            size={"xs"}
            onClick={handleGoToToday}
            className="rounded-sm"
            onMouseEnter={prefetchToday}
            onFocus={prefetchToday}
            disabled={day === today}
          >
            <CalendarSync className="size-4" />
          </ButtonWithTooltip>
        </div>
      </div>
    </header>
  );
}

function JournalDatePicker({ selectedDay }: { selectedDay: string }) {
  const router = useRouter();
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      router.push(`/journal?day=${formattedDate}`);
    }
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} size={"sm"} className="text-xl font-medium">
          {format(parseDate(selectedDay), "MMMM d, yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={parseDate(selectedDay)}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}

function parseDate(dateString: string) {
  return parse(dateString, "yyyy-MM-dd", new Date());
}
