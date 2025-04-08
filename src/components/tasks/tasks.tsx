"use client";

import NewTaskDialog from "@/components/tasks/new-task-dialog";
import { Task as TaskType } from "@/lib/types";
import Task from "./task";
import { format, isToday, isTomorrow } from "date-fns";
import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  SignalLow,
  SignalMedium,
  SignalHigh,
  TriangleAlert,
} from "lucide-react";

export default function Tasks({ tasks }: { tasks: TaskType[] }) {
  const [status, setStatus] = useQueryState("status");
  const [priority, setPriority] = useQueryState("priority");

  const unscheduledTasks = tasks.filter((task) => !task.due_date);
  const scheduledTasks = tasks.filter((task) => task.due_date);

  const groupedTasks: Record<string, TaskType[]> = {};

  scheduledTasks.forEach((task) => {
    const dueDate = new Date(task.due_date!);
    const dayName = getDayName(dueDate);

    if (!groupedTasks[dayName]) {
      groupedTasks[dayName] = [];
    }

    groupedTasks[dayName].push(task);
  });

  const sortedGroups = Object.entries(groupedTasks).sort((a, b) => {
    const dateA = a[1][0].due_date
      ? new Date(a[1][0].due_date)
      : new Date(9999, 11, 31);
    const dateB = b[1][0].due_date
      ? new Date(b[1][0].due_date)
      : new Date(9999, 11, 31);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="flex h-screen flex-col">
      <header className="bg-sidebar sticky top-0 z-10 flex w-full items-center justify-between border-b px-4 py-2">
        <h3 className="font-mono font-medium">Tasks</h3>
        <div className="flex items-center justify-end space-x-2">
          <Select name="status" onValueChange={(value) => setStatus(value)}>
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
          <Select name="priority" onValueChange={(value) => setPriority(value)}>
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
          <NewTaskDialog />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-muted-foreground flex h-full items-center justify-center p-8 text-center">
            No tasks found. Create your first one!
          </div>
        ) : (
          <div>
            {unscheduledTasks.length > 0 && (
              <div>
                <h4 className="bg-accent/30 px-4 py-2 text-sm font-medium">
                  Unscheduled
                </h4>
                <ul className="divide-border divide-y divide-dashed">
                  {unscheduledTasks.map((task: TaskType) => (
                    <Task task={task} key={task.id} />
                  ))}
                </ul>
              </div>
            )}

            {sortedGroups.map(([dayName, dayTasks]) => (
              <div key={dayName}>
                <h4 className="bg-accent/30 px-4 py-2 text-sm font-medium">
                  {dayName}
                </h4>
                <ul className="divide-border divide-y divide-dashed">
                  {dayTasks.map((task: TaskType) => (
                    <Task task={task} key={task.id} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const getDayName = (date: Date): string => {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "MMM d");
};
