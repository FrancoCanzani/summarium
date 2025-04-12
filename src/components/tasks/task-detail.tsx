"use client";

import EditorBubbleMenu from "@/components/editor-bubble-menu";
import { renderPriorityIcon, renderStatusIcon } from "@/components/tasks/task";
import { ToolbarProvider } from "@/components/toolbars/toolbar-provider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateTask } from "@/lib/actions";
import { extensions } from "@/lib/extensions/extensions";
import { Task as TaskType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EditorContent, useEditor } from "@tiptap/react";
import { format, parseISO } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import TimeCalendar from "../ui/time-calendar";

const taskStatusOptions = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "complete", label: "Complete" },
  { value: "wont-do", label: "Won't Do" },
];

const taskPriorityOptions = [
  { value: "no-priority", label: "No Priority" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export default function TaskDetail({ task }: { task: TaskType }) {
  const [title, setTitle] = useState(task.title || "");
  const [status, setStatus] = useState(task.status || "backlog");
  const [priority, setPriority] = useState(task.priority || "no-priority");

  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.due_date ? parseISO(task.due_date.toString()) : undefined,
  );
  const [description, setDescription] = useState(
    task.sanitized_description || "",
  );

  const editor = useEditor({
    extensions,
    content: description,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setDescription(newContent);
      handleDebouncedDescriptionChange(editor.getHTML());
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
  });

  const handleSave = async (updates: Partial<TaskType>) => {
    try {
      // Ensure due_date is either Date or null for the update
      const payload: Partial<TaskType> = {
        ...updates,
        ...(updates.due_date !== undefined && {
          due_date: updates.due_date instanceof Date ? updates.due_date : null,
        }),
      };

      const result = await updateTask(task.id, payload);
      if (!result.success) {
        toast.error(result.error || "Failed to update task");
      } else {
        toast.success("Saved");
      }
    } catch (err) {
      toast.error("An error occurred while updating the task.");
      console.error(err);
    }
  };

  const handleDebouncedTitleChange = useDebouncedCallback(
    (newTitle: string) => {
      handleSave({ title: newTitle });
    },
    1000,
  );

  const handleDebouncedDescriptionChange = useDebouncedCallback(
    (newDescription: string) => {
      handleSave({
        description: newDescription,
        sanitized_description: editor?.getText(),
      });
    },
    1000,
  );

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    handleDebouncedTitleChange(e.target.value);
  };

  const onStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    handleSave({ status: newStatus });
  };

  const onPriorityChange = (newPriority: string) => {
    setPriority(newPriority);
    handleSave({ priority: newPriority });
  };

  const onDueDateChange = (date: Date | undefined) => {
    setDueDate(date);
    handleSave({ due_date: date });
  };

  if (!editor) return null;

  return (
    <ToolbarProvider editor={editor}>
      <div className="flex h-full items-start justify-center">
        <div className="mx-auto flex h-full w-full flex-col overflow-y-auto p-4 lg:w-3/4">
          <header className="pb-8">
            <div className="flex flex-col items-start justify-center gap-4 text-sm lg:flex-row lg:justify-between">
              <input
                className="w-full flex-1 border-none text-xl outline-none md:text-2xl lg:w-full"
                placeholder="Title"
                value={title}
                onChange={onTitleChange}
              />

              <div className="flex items-center justify-start gap-2 lg:justify-end">
                <Select value={status} onValueChange={onStatusChange}>
                  <SelectTrigger className="h-8">
                    <div className="flex items-center gap-2">
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    {taskStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex w-full items-center justify-start space-x-2 text-xs">
                          {renderStatusIcon(option.value)}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priority} onValueChange={onPriorityChange}>
                  <SelectTrigger className="h-8">
                    <div className="flex items-center gap-2">
                      <SelectValue placeholder="Priority" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    {taskPriorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex w-full items-center justify-start space-x-2 text-xs">
                          {renderPriorityIcon(option.value)}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      className={cn(
                        "h-8 justify-start gap-2 text-left text-xs font-normal md:w-auto",
                        !dueDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="size-3" />
                      {dueDate ? (
                        format(dueDate, "MMM d, yyyy h:mm a")
                      ) : (
                        <span>Due date</span>
                      )}
                      {dueDate && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-muted ml-auto size-5"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDueDateChange(undefined);
                          }}
                        >
                          <X className="size-3" />
                        </Button>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <TimeCalendar value={dueDate} onChange={onDueDateChange} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </header>

          <section className="flex-1">
            <Label className="mb-4">Description</Label>
            <div className="h-full w-full flex-1">
              <EditorBubbleMenu />
              <EditorContent
                editor={editor}
                className="prose prose-p:my-0 prose-sm my-0 h-full min-w-full flex-1 overflow-scroll text-start focus:outline-none"
              />
            </div>
          </section>

          <Separator className="my-4 lg:hidden" />

          <section className="mb-14 pb-14 lg:hidden">
            <Label className="mb-4">Activity</Label>
            <div className="space-y-4">
              <form className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  className="min-h-[80px] rounded-sm text-xs"
                />
                <div className="flex justify-end">
                  <Button type="submit" size="xs">
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </section>
        </div>
        <div className="bg-sidebar hidden h-full w-1/4 flex-col justify-between p-4 lg:flex">
          <Label className="mb-4">Activity</Label>
          <div className="space-y-4">
            <form className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                className="min-h-[80px] rounded-sm text-xs"
              />
              <div className="flex justify-end">
                <Button type="submit" size="xs">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ToolbarProvider>
  );
}
