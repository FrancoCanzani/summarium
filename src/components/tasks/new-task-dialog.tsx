"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  X,
  SignalLow,
  SignalMedium,
  SignalHigh,
  TriangleAlert,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SubmitButton } from "../ui/submit-button";
import { createTask } from "@/lib/actions";
import { taskSchema } from "@/lib/schemas";
import { useState } from "react";

export default function NewTaskDialog() {
  const [open, setOpen] = useState(false);

  async function handleFormAction(formData: FormData) {
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      status: formData.get("status") as string,
      priority: formData.get("priority") as string,
    };

    const validationResult = taskSchema.safeParse(data);

    if (!validationResult.success) {
      const errors = validationResult;

      console.log(errors);
      toast.error("Validation Failed");

      return;
    }

    try {
      const result = await createTask(formData);

      if (!result.success) {
        if (result.errors) {
          const errorMessages = Object.entries(result.errors)
            .map(([field, messages]) => {
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
              return `${fieldName}: ${messages[0]}`;
            })
            .join("\n");

          toast.error("Server Validation Failed", {
            description: errorMessages,
          });
        } else {
          toast.error("Task creation failed", {
            description: result.errors || "An unknown error occurred",
          });
        }
        return;
      }

      toast.success("Task created successfully");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger>
        <Button variant="outline" size="xs">
          <Plus className="size-4" />
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
              placeholder="Issue title"
              name="title"
              required
            />

            <Textarea
              className="my-5 w-full resize-none border-0 p-0 shadow-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Add description..."
              name="description"
            />

            <Input
              className="w-full border-0 p-0 shadow-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Next tuesday"
              name="date"
            />
          </div>

          <div className="flex items-center gap-2 border-t p-4">
            <div className="flex items-center gap-2">
              <Select name="status">
                <SelectTrigger className="h-8 rounded-sm px-3 text-xs">
                  <div className="flex items-center">
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-sm">
                  <SelectItem value="backlog">
                    <div className="flex items-center">
                      <span className="mr-2 text-orange-500">●</span>
                      Backlog
                    </div>
                  </SelectItem>
                  <SelectItem value="todo">
                    <div className="flex items-center">
                      <span className="mr-2 text-blue-500">●</span>
                      Todo
                    </div>
                  </SelectItem>
                  <SelectItem value="in-progress">
                    <div className="flex items-center">
                      <span className="mr-2 text-yellow-500">●</span>
                      In Progress
                    </div>
                  </SelectItem>
                  <SelectItem value="complete">
                    <div className="flex items-center">
                      <span className="mr-2 text-green-500">●</span>
                      Complete
                    </div>
                  </SelectItem>
                  <SelectItem value="wont-do">
                    <div className="flex items-center">
                      <span className="mr-2 text-red-500">●</span>
                      Won&apos;t do
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select name="priority">
                <SelectTrigger className="h-8 rounded-sm px-3 text-xs">
                  <div className="flex items-center">
                    <SelectValue placeholder="Priority" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-sm">
                  <SelectItem value="no-priority">
                    <div className="flex w-full items-center justify-start space-x-2">
                      <X className="size-4" />
                      <span>No Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex w-full items-center justify-start space-x-2">
                      <TriangleAlert className="size-4" />
                      <span>Urgent</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex w-full items-center justify-start space-x-2">
                      <SignalHigh className="size-4" />
                      <span>High</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex w-full items-center justify-start space-x-2">
                      <SignalMedium className="size-4" />
                      <span>Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex w-full items-center justify-start space-x-2">
                      <SignalLow className="size-4" />
                      <span>Low</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto">
              <SubmitButton
                defaultText="Create task"
                loadingText="Creating..."
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
