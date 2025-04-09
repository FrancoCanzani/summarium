"use client";

import { useState } from "react";
import NewTaskDialog from "@/components/tasks/new-task-dialog";
import { Task as TaskType } from "@/lib/types";
import Task from "./task";
import { format, isToday, isTomorrow } from "date-fns";
import { useQueryState } from "nuqs";
import {
  X,
  SignalLow,
  SignalMedium,
  SignalHigh,
  TriangleAlert,
  ListFilter,
  Layers,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function Tasks({ tasks }: { tasks: TaskType[] }) {
  const [status, setStatus] = useQueryState("status");
  const [priority, setPriority] = useQueryState("priority");
  const [view, setView] = useQueryState("view", { defaultValue: "all" });

  const [selected, setSelected] = useState<string[]>([]);

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
        <h3 className="font-medium">Your Tasks</h3>
        <div className="flex items-center justify-end space-x-1">
          {selected.length > 0 && (
            <Button
              variant={"outline"}
              size={"sm"}
              className="flex items-center justify-center space-x-1 border-dashed font-normal"
              onClick={() => setSelected([])}
            >
              {selected.length} Selected
              <X className="size-3.5" />
            </Button>
          )}
          <Button
            variant={"outline"}
            size={"sm"}
            className={cn(
              "flex items-center justify-center space-x-1.5 font-normal",
              view === "all" && "bg-accent shadow-inner",
            )}
            onClick={() => setView("all")}
          >
            <Layers className="size-3.5" />
            All Tasks
          </Button>
          <Button
            variant={"outline"}
            size={"sm"}
            className={cn(
              "flex items-center justify-center space-x-1.5 font-normal",
              view === "active" && "bg-accent shadow-inner",
            )}
            onClick={() => setView("active")}
          >
            <Circle className="size-3.5" />
            Active
          </Button>
          {status && (
            <Button
              variant={"outline"}
              size={"sm"}
              className="flex items-center justify-center space-x-1"
              onClick={() => setStatus(null)}
            >
              <span>{status}</span>
              <X className="size-3.5" />
            </Button>
          )}
          {priority && (
            <Button
              variant={"outline"}
              size={"sm"}
              className="flex items-center justify-center space-x-1"
              onClick={() => setPriority(null)}
            >
              <span>{priority}</span>
              <X className="size-3.5" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-start space-x-1 font-normal"
              >
                <ListFilter className="size-3.5" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-sm">
              <DropdownMenuLabel>Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setStatus("backlog")}>
                        <div className="flex items-center">
                          <span className="mr-2 text-orange-500">●</span>
                          Backlog
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatus("todo")}>
                        <div className="flex items-center">
                          <span className="mr-2 text-blue-500">●</span>
                          Todo
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatus("in-progress")}
                      >
                        <div className="flex items-center">
                          <span className="mr-2 text-yellow-500">●</span>
                          In Progress
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatus("complete")}>
                        <div className="flex items-center">
                          <span className="mr-2 text-green-500">●</span>
                          Complete
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatus("no-do")}>
                        <div className="flex items-center">
                          <span className="mr-2 text-red-500">●</span>
                          Won&apos;t do
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => setPriority("no-priority")}
                      >
                        <div className="flex w-full items-center justify-start space-x-2">
                          <X className="size-3.5" />
                          <span>No Priority</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriority("urgent")}>
                        <div className="flex w-full items-center justify-start space-x-2">
                          <TriangleAlert className="size-3.5" />
                          <span>Urgent</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriority("high")}>
                        <div className="flex w-full items-center justify-start space-x-2">
                          <SignalHigh className="size-3.5" />
                          <span>High</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriority("medium")}>
                        <div className="flex w-full items-center justify-start space-x-2">
                          <SignalMedium className="size-3.5" />
                          <span>Medium</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPriority("low")}>
                        <div className="flex w-full items-center justify-start space-x-2">
                          <SignalLow className="size-3.5" />
                          <span>Low</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setStatus(null);
                  setPriority(null);
                }}
              >
                Reset
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <NewTaskDialog />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="text-muted-foreground flex h-full items-center justify-center p-8 text-center">
            No tasks found. Create your first one!
          </div>
        ) : (
          <div className="pl-2">
            {unscheduledTasks.length > 0 && (
              <div className="group">
                <h4 className="py-2 text-sm font-medium">Unscheduled</h4>
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
                <h4 className="py-2 text-sm font-medium">{dayName}</h4>
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
