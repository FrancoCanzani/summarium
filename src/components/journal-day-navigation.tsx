"use client";

import * as React from "react";
import { ReactNode } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format, parse } from "date-fns";
import { Button } from "./ui/button";
import { CalendarOff, ChevronLeft, ChevronRight } from "lucide-react";
import ButtonWithTooltip from "./ui/button-with-tooltip";
import { useJournalDate } from "@/lib/hooks/use-journal-date";

export default function JournalDayNavigation() {
  const { currentDay, setDay, isToday, formattedDate } = useJournalDate();

  const parseDate = (dateString: string) => {
    return parse(dateString, "yyyy-MM-dd", new Date());
  };

  const handleDayChange = (offset: number) => {
    const currentDate = parseDate(currentDay);
    const newDate = addDays(currentDate, offset);
    const formattedDate = format(newDate, "yyyy-MM-dd");
    setDay(formattedDate);
  };

  const handleGoToToday = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    setDay(today);
  };

  return (
    <header className="mx-auto mt-4 flex w-full max-w-5xl flex-col items-start justify-evenly gap-4">
      <JournalDatePicker>
        <Button
          variant={"ghost"}
          size={"lg"}
          className="p-3 text-xl font-medium sm:text-2xl lg:text-3xl"
        >
          {formattedDate}
        </Button>
      </JournalDatePicker>
      <div className="flex items-center justify-center space-x-2 px-3">
        <Button
          variant={"outline"}
          size={"xs"}
          onClick={() => handleDayChange(-1)}
          className="rounded-sm"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant={"outline"}
          size={"xs"}
          onClick={() => handleDayChange(1)}
          className="rounded-sm"
        >
          <ChevronRight className="size-4" />
        </Button>
        {!isToday && (
          <ButtonWithTooltip
            tooltipText="Today"
            variant={"outline"}
            size={"xs"}
            onClick={handleGoToToday}
            className="rounded-sm"
          >
            <CalendarOff className="size-4" />
          </ButtonWithTooltip>
        )}
      </div>
    </header>
  );
}

function JournalDatePicker({ children }: { children: ReactNode }) {
  const { currentDay, setDay } = useJournalDate();

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setDay(formattedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={parseDate(currentDay)}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function parseDate(dateString: string) {
  return parse(dateString, "yyyy-MM-dd", new Date());
}
