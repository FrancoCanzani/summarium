"use client";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { createTask } from "@/lib/actions";
import { taskSchema } from "@/lib/schemas";
import {
  CheckCircle2,
  Circle,
  CircleDashed,
  CircleDotDashed,
  CircleSlash,
  SignalHigh,
  SignalLow,
  SignalMedium,
  TriangleAlert,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function NewTaskDialog() {
  const [open, setOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>(
    undefined,
  );

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedDateTime(undefined);
    }
    setOpen(isOpen);
  };

  async function handleFormAction(formData: FormData) {
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: selectedDateTime,
      status: formData.get("status") as string,
      priority: formData.get("priority") as string,
    };

    const validationResult = taskSchema.safeParse(data);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.errors
        .map((err) => `${err.path.join(".")} (${err.code}): ${err.message}`)
        .join("\n");

      console.error("Client Validation Failed:", validationResult.error.errors);
      toast.error("Validation Failed", {
        description: (
          <pre className="mt-1 whitespace-pre-wrap text-xs">
            {formattedErrors}
          </pre>
        ),
      });
      return;
    }

    try {
      const result = await createTask(formData);

      if (!result.success) {
        console.error("Server Action Error:", result.errors);
        if (result.errors) {
          const errorMessages = Object.entries(result.errors)
            .map(([field, messages]) => {
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
              return `${fieldName}: ${Array.isArray(messages) ? messages.join(", ") : messages}`;
            })
            .join("\n");

          toast.error("Server Validation Failed", {
            description: (
              <pre className="mt-1 whitespace-pre-wrap text-xs">
                {errorMessages}
              </pre>
            ),
          });
        } else {
          toast.error("Task creation failed", {
            description: "An unknown server error occurred.",
          });
        }
        return;
      }

      toast.success("Task created successfully");
      handleOpenChange(false);
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Something went wrong", {
        description: "An unexpected error occurred during submission.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="font-normal">
          New
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden rounded-sm p-0 sm:max-w-[650px]">
        <DialogTitle className="w-full border-b p-4 font-medium capitalize">
          New task
        </DialogTitle>

        <form action={handleFormAction}>
          <div className="p-4">
            <Input
              className="w-full border-0 p-0 text-lg font-medium shadow-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Task title"
              name="title"
              required
              aria-label="Task title"
            />

            <Textarea
              className="my-5 w-full resize-none border-0 p-0 shadow-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Add description..."
              name="description"
              aria-label="Task description"
            />
          </div>

          <div className="flex items-center justify-start border-t p-2">
            <div className="flex flex-wrap items-center gap-2">
              <Select name="status" required>
                <SelectTrigger className="h-8 min-w-[100px] rounded-sm px-3 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-sm">
                  <SelectItem value="backlog" className="text-xs">
                    <CircleDashed className="mr-2 inline-block size-3.5" />
                    Backlog
                  </SelectItem>
                  <SelectItem value="todo" className="text-xs">
                    <Circle className="mr-2 inline-block size-3.5" />
                    Todo
                  </SelectItem>
                  <SelectItem value="in-progress" className="text-xs">
                    <CircleDotDashed className="mr-2 inline-block size-3.5" />
                    In Progress
                  </SelectItem>
                  <SelectItem value="complete" className="text-xs">
                    <CheckCircle2 className="mr-2 inline-block size-3.5" />
                    Complete
                  </SelectItem>
                  <SelectItem value="wont-do" className="text-xs">
                    <CircleSlash className="mr-2 inline-block size-3.5" />
                    Won&apos;t do
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select name="priority" required>
                <SelectTrigger className="h-8 min-w-[110px] rounded-sm px-3 text-xs">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="rounded-sm">
                  <SelectItem value="no-priority" className="text-xs">
                    <X className="mr-2 inline-block size-3.5" />
                    No Priority
                  </SelectItem>
                  <SelectItem value="urgent" className="text-xs">
                    <TriangleAlert className="mr-2 inline-block size-3.5" />
                    Urgent
                  </SelectItem>
                  <SelectItem value="high" className="text-xs">
                    <SignalHigh className="mr-2 inline-block size-3.5" />
                    High
                  </SelectItem>
                  <SelectItem value="medium" className="text-xs">
                    <SignalMedium className="mr-2 inline-block size-3.5" />
                    Medium
                  </SelectItem>
                  <SelectItem value="low" className="text-xs">
                    <SignalLow className="mr-2 inline-block size-3.5" />
                    Low
                  </SelectItem>
                </SelectContent>
              </Select>

              <DateTimePicker
                date={selectedDateTime}
                onDateChange={setSelectedDateTime}
                placeholder="Due date (optional)"
                className="h-8 text-xs"
              />
              {selectedDateTime && (
                <input
                  type="hidden"
                  name="date"
                  value={selectedDateTime.toISOString()}
                />
              )}
            </div>

            <div className="ml-auto">
              <SubmitButton
                defaultText="Create task"
                loadingText="Creating..."
                className="h-8 text-xs"
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
