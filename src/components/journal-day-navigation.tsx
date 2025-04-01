"use client";

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
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { validateDateParam } from "@/lib/utils";

export default function JournalDayNavigation() {
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

  return (
    <header className="bg-background sticky top-0 z-10 w-full border-b px-4 py-4">
      <div className="mx-auto flex max-w-5xl flex-row items-center justify-between">
        <JournalDatePicker selectedDay={selectedDay}>
          <Button
            variant={"ghost"}
            size={"lg"}
            className="p-3 text-xl font-medium sm:text-2xl lg:text-3xl"
          >
            {format(parseDate(selectedDay), "MMMM d, yyyy")}
          </Button>
        </JournalDatePicker>

        <div className="flex items-center justify-center space-x-2">
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
          <ButtonWithTooltip
            tooltipText="Today"
            variant={"outline"}
            size={"xs"}
            onClick={handleGoToToday}
            className="rounded-sm"
          >
            <CalendarOff className="size-4" />
          </ButtonWithTooltip>
        </div>
      </div>
    </header>
  );
}

function JournalDatePicker({
  children,
  selectedDay,
}: {
  children: ReactNode;
  selectedDay: string;
}) {
  const router = useRouter();

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      router.push(`/journal?day=${formattedDate}`);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={parseDate(selectedDay)}
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
