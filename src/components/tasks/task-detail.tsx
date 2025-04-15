"use client";

import { renderPriorityIcon, renderStatusIcon } from "@/components/tasks/task";
import { ToolbarProvider } from "@/components/toolbars/toolbar-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTask } from "@/lib/actions";
import { extensions } from "@/lib/extensions/extensions";
import { Task as TaskType } from "@/lib/types";
import { EditorContent, useEditor } from "@tiptap/react";
import { parseISO } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import EditorBubbleMenu from "../notes/editor-bubble-menu";
import { DateTimePicker } from "../ui/date-time-picker";
import { Label } from "../ui/label";

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
      const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const result = await updateTask(task.id, updatesWithTimestamp);
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

  const onDueDateChange = (selectedDate: Date | undefined) => {
    setDueDate(selectedDate);

    const dateForSaving: string | null = selectedDate
      ? selectedDate.toISOString()
      : null;

    const initialDateForSaving = task.due_date
      ? new Date(task.due_date).toISOString()
      : null;

    if (dateForSaving !== initialDateForSaving) {
      handleSave({ due_date: dateForSaving });
    }
  };

  if (!editor) return null;

  return (
    <ToolbarProvider editor={editor}>
      <div className="lg:max-w-3/4 mx-auto flex w-full flex-1 flex-col p-2 lg:overflow-y-auto">
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
              <DateTimePicker
                date={dueDate}
                onDateChange={onDueDateChange}
                placeholder="Set due date"
                className="h-8 text-xs"
                aria-label="Task Due Date"
              />{" "}
            </div>
          </div>
        </header>

        <section className="mx-auto w-full md:w-[65ch]">
          <Label className="mb-4">Description</Label>
          <div className="w-full flex-1">
            <EditorBubbleMenu />
            <EditorContent
              editor={editor}
              className="prose prose-p:my-0 prose-sm my-0 min-w-full flex-1 text-start text-black focus:outline-none"
            />
          </div>
        </section>
      </div>
    </ToolbarProvider>
  );
}
