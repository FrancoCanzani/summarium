"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function DateTimePicker({
  date,
  onDateChange,
  disabled = false,
  className,
  placeholder = "Select date & time...",
}: DateTimePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const timeValue = React.useMemo(() => {
    return date ? format(date, "HH:mm") : "";
  }, [date]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onDateChange(undefined);
      return;
    }

    const newDate = new Date(selectedDate);
    const currentHours = date ? date.getHours() : 0;
    const currentMinutes = date ? date.getMinutes() : 0;

    newDate.setHours(currentHours);
    newDate.setMinutes(currentMinutes);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);

    onDateChange(newDate);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = event.target.value;
    if (!timeString) return;

    const baseDate = date ? new Date(date) : new Date();

    try {
      const [hours, minutes] = timeString.split(":").map(Number);

      if (!isNaN(hours) && !isNaN(minutes)) {
        baseDate.setHours(hours);
        baseDate.setMinutes(minutes);
        baseDate.setSeconds(0);
        baseDate.setMilliseconds(0);
        onDateChange(new Date(baseDate));
      }
    } catch (error) {
      console.error("Failed to parse time:", error);
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-9 justify-start rounded-sm px-3 text-left text-sm font-normal",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="size-4" />
          {date ? format(date, "PPP HH:mm") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          autoFocus
          disabled={disabled}
        />
        <div className="border-border border-t p-3">
          <Label htmlFor="time-input" className="text-xs font-medium">
            Time (24h)
          </Label>
          <Input
            id="time-input"
            type="time"
            step="60"
            value={timeValue}
            onChange={handleTimeChange}
            className="mt-1 h-8 rounded-sm text-xs"
            disabled={disabled || !date}
            aria-label="Time selector"
          />
          {!date && !disabled && (
            <p className="text-muted-foreground mt-1 text-xs">
              Select a date first to enable time selection.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
