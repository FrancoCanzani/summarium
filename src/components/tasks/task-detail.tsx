"use client";

import { useState } from "react";
import { Task as TaskType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditorContent, useEditor } from "@tiptap/react";
import { extensions } from "@/lib/extensions/extensions";
import { ToolbarProvider } from "@/components/toolbars/toolbar-provider";
import EditorBubbleMenu from "@/components/editor-bubble-menu";
import { useDebouncedCallback } from "use-debounce";
import { updateTask } from "@/lib/actions";
import { toast } from "sonner";
import { renderStatusIcon, renderPriorityIcon } from "@/components/tasks/task";
import { parseISO } from "date-fns";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

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
  const [dueDate, setDueDate] = useState<Date | null>(
    task.due_date ? parseISO(task.due_date.toString()) : null,
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
      const result = await updateTask(task.id, updates);
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
      handleSave({ description: newDescription });
      handleSave({ sanitized_description: editor?.getText() });
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
    const newDate = date || null;
    setDueDate(newDate);
    handleSave({ due_date: newDate });
  };

  if (!editor) return null;

  return (
    <ToolbarProvider editor={editor}>
      <div className="container mx-auto flex h-full max-w-3xl flex-col p-4 pb-14 md:pb-4">
        <header className="pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <input
              className="flex-1 border-none text-xl outline-none md:text-2xl"
              placeholder="Title"
              value={title}
              onChange={onTitleChange}
            />
            <div className="flex items-center justify-end gap-2">
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
                  <SelectValue placeholder="Priority" />
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
            </div>
          </div>
        </header>

        <section className="flex-1">
          <Label className="mb-4">Description</Label>
          <div className="h-full w-full flex-1">
            <EditorBubbleMenu />
            <EditorContent
              editor={editor}
              className="prose prose-sm my-0 h-full min-w-full flex-1 text-start focus:outline-none"
            />
          </div>
        </section>

        <Separator className="my-4" />

        <section>
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
    </ToolbarProvider>
  );
}
