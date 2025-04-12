"use client";

import * as React from "react";

import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface TimeCalendarProps {
  /** The currently selected date and time. */
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  calendarProps?: Omit<CalendarProps, "selected" | "onSelect" | "mode">;
  timeInputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type"
  >;
  className?: string;
  /** Granularity for the time input (e.g., "seconds" or "minutes") */
  granularity?: "seconds" | "minutes";
}

export default function TimeCalendar({
  value: initialValue,
  onChange,
  calendarProps,
  timeInputProps,
  className,
  granularity = "minutes",
}: TimeCalendarProps) {
  const timeInputId = React.useId();

  const [value, setValue] = React.useState<Date | undefined>(
    initialValue ?? undefined,
  );

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const timeString = React.useMemo(() => {
    if (!value) return "";
    return format(value, granularity === "seconds" ? "HH:mm:ss" : "HH:mm");
  }, [value, granularity]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setValue(undefined);
      onChange?.(undefined);
      return;
    }

    const currentTime = value ?? new Date(0);
    const newDateTime = new Date(selectedDate);

    newDateTime.setHours(
      currentTime.getHours(),
      currentTime.getMinutes(),
      currentTime.getSeconds(),
      currentTime.getMilliseconds(),
    );

    setValue(newDateTime);
    onChange?.(newDateTime);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = event.target.value;
    if (!timeString) return;

    const currentDatePart = value ?? new Date();
    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    const newDateTime = new Date(currentDatePart);
    newDateTime.setHours(hours || 0, minutes || 0, seconds || 0, 0);

    setValue(newDateTime);
    onChange?.(newDateTime);
  };

  const timeStep = granularity === "seconds" ? "1" : "60";

  return (
    <div className={cn("rounded-md border", className)}>
      <Calendar
        mode="single"
        className="p-2"
        selected={value}
        onSelect={handleDateSelect}
        {...calendarProps}
      />
      <div className="border-t p-2">
        <div className="flex items-center justify-center gap-2">
          <Label htmlFor={timeInputId} className="text-start text-xs">
            Time
          </Label>
          <Input
            id={timeInputId}
            type="time"
            step={timeStep}
            value={timeString}
            onChange={handleTimeChange}
            className="block w-full appearance-none text-sm [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            disabled={!value}
            {...timeInputProps}
          />
        </div>
      </div>
    </div>
  );
}
