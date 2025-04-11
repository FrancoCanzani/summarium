"use client";

import { useState } from "react";
import { Task as TaskType } from "@/lib/types";
import Task from "./task";
import { format, isToday, isTomorrow } from "date-fns";
import { useQueryState } from "nuqs";
import TasksHeader from "./tasks-header";
import { Separator } from "../ui/separator";

export default function Tasks({ tasks }: { tasks: TaskType[] }) {
  const [status] = useQueryState("status");
  const [priority] = useQueryState("priority");
  const [view] = useQueryState("view", { defaultValue: "all" });

  const [selected, setSelected] = useState<string[]>([]);

  const filteredTasks = tasks.filter((task) => {
    if (status && task.status?.toLowerCase() !== status.toLowerCase()) {
      return false;
    }

    if (priority && task.priority?.toLowerCase() !== priority.toLowerCase()) {
      return false;
    }

    if (view === "active") {
      return (
        task.status?.toLowerCase() !== "complete" &&
        task.status?.toLowerCase() !== "wont-do"
      );
    }

    return true;
  });

  const unscheduledTasks = filteredTasks.filter((task) => !task.due_date);
  const scheduledTasks = filteredTasks.filter((task) => task.due_date);

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
      <TasksHeader
        selected={selected}
        setSelected={setSelected}
        tasks={tasks}
      />

      <div className="flex-1 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="text-muted-foreground flex h-full items-center justify-center p-8 text-center">
            {tasks.length === 0
              ? "No tasks found. Create your first one!"
              : "No matching tasks for current filters."}
          </div>
        ) : (
          <div className="pl-2">
            {unscheduledTasks.length > 0 && (
              <div className="group">
                <div className="flex items-center space-x-2">
                  <h4 className="py-2 text-xs font-medium">Unscheduled</h4>
                  <Separator />
                </div>
                <ul className="divide-border group-hover:border-l-zed border-l-zed-light divide-y divide-dashed border-l-2 transition-colors duration-200">
                  {unscheduledTasks.map((task: TaskType) => (
                    <Task
                      task={task}
                      key={task.id}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  ))}
                </ul>
              </div>
            )}

            {sortedGroups.map(([dayName, dayTasks]) => (
              <div key={dayName} className="group">
                <div className="flex items-center space-x-2">
                  <h4 className="py-2 text-xs font-medium">{dayName}</h4>
                  <Separator />
                </div>
                <ul className="divide-border group-hover:border-l-zed border-l-zed-light divide-y divide-dashed border-l-2 transition-colors duration-200">
                  {dayTasks.map((task: TaskType) => (
                    <Task
                      task={task}
                      key={task.id}
                      selected={selected}
                      setSelected={setSelected}
                    />
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
