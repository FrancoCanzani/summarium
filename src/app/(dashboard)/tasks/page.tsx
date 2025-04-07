import NewTaskDialog from "@/components/tasks/new-task-dialog";
import { getTasks } from "@/lib/api/tasks";
import { getCachedUser } from "@/lib/api/auth";
import { cache } from "react";
import { redirect } from "next/navigation";
import { Task } from "@/lib/types";
import {
  Circle,
  CircleDashed,
  CircleDotDashed,
  CheckCircle2,
  CircleSlash,
  MoreHorizontal,
  AlertTriangle,
  SignalHigh,
  SignalMedium,
  SignalLow,
} from "lucide-react";
import {
  format,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  parseISO,
} from "date-fns";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const getCachedTasks = cache(async () => {
  const { data, error } = await getCachedUser();
  if (error || !data || !data.user) {
    redirect("/login");
  }
  return await getTasks(data.user.id);
});

const renderStatusIcon = (status: string | undefined | null) => {
  const size = "size-4";
  let icon: React.ReactNode;
  let tooltipText: string;
  let colorClass = "text-muted-foreground";

  switch (status?.toLowerCase()) {
    case "backlog":
      icon = <CircleDashed className={cn(size, colorClass)} />;
      tooltipText = "Backlog";
      colorClass = "text-gray-500";
      break;
    case "todo":
      icon = <Circle className={cn(size, colorClass)} />;
      tooltipText = "Todo";
      colorClass = "text-blue-500";
      break;
    case "in-progress":
      icon = <CircleDotDashed className={cn(size, colorClass)} />;
      tooltipText = "In Progress";
      colorClass = "text-yellow-500";
      break;
    case "complete":
      icon = <CheckCircle2 className={cn(size, colorClass)} />;
      tooltipText = "Complete";
      colorClass = "text-green-500";
      break;
    case "wont-do":
      icon = <CircleSlash className={cn(size, colorClass)} />;
      tooltipText = "Won't Do";
      colorClass = "text-red-500";
      break;
    default:
      icon = <Circle className={cn(size, colorClass)} />;
      tooltipText = "Todo";
      colorClass = "text-blue-500";
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn(colorClass)}>{icon}</span>
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
};

const renderPriorityIcon = (priority: string | undefined | null) => {
  const size = "size-4";
  let icon: React.ReactNode;
  let tooltipText: string;
  let colorClass = "text-muted-foreground";

  switch (priority?.toLowerCase()) {
    case "urgent":
      icon = <AlertTriangle className={cn(size, colorClass)} />;
      tooltipText = "Urgent";
      colorClass = "text-red-600";
      break;
    case "high":
      icon = <SignalHigh className={cn(size, colorClass)} />;
      tooltipText = "High";
      colorClass = "text-orange-500";
      break;
    case "medium":
      icon = <SignalMedium className={cn(size, colorClass)} />;
      tooltipText = "Medium";
      colorClass = "text-yellow-500";
      break;
    case "low":
      icon = <SignalLow className={cn(size, colorClass)} />;
      tooltipText = "Low";
      colorClass = "text-blue-500";
      break;
    case "no-priority":
    default:
      icon = <MoreHorizontal className={cn(size, colorClass)} />;
      tooltipText = "No Priority";
      break;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn(colorClass)}>{icon}</span>
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
};

const getDayName = (date: Date): string => {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "EEEE");
};

export default async function TasksPage() {
  const tasks = await getCachedTasks();

  const unscheduledTasks = tasks.filter((task) => !task.due_date);
  const scheduledTasks = tasks.filter((task) => task.due_date);

  const groupedTasks: Record<string, Task[]> = {};

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
      <header className="bg-sidebar sticky top-0 z-10 flex w-full items-center justify-between border-b p-2">
        <h3 className="font-medium">Tasks</h3>
        <NewTaskDialog />
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
                  {unscheduledTasks.map((task: Task) => (
                    <li
                      key={task.id}
                      className="hover:bg-accent/50 flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-100"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {renderStatusIcon(task.status)}
                        {renderPriorityIcon(task.priority)}
                        <span
                          className="flex-shrink truncate text-sm font-medium"
                          title={task.title}
                        >
                          {task.title}
                        </span>
                        <span className="text-muted-foreground flex-shrink-0 truncate text-xs">
                          {task.description}
                        </span>
                      </div>

                      <div className="flex flex-shrink-0 items-center gap-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-muted-foreground text-xs">
                              {formatDistanceToNow(new Date(task.updated_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Last Updated:{" "}
                            {format(new Date(task.updated_at), "PPP p")}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </li>
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
                  {dayTasks.map((task: Task) => (
                    <li
                      key={task.id}
                      className="hover:bg-accent/50 flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-100"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {renderStatusIcon(task.status)}
                        {renderPriorityIcon(task.priority)}
                        <span
                          className="flex-shrink truncate text-sm font-medium"
                          title={task.title}
                        >
                          {task.title}
                        </span>
                        <span className="text-muted-foreground flex-shrink-0 truncate text-xs">
                          {task.description}
                        </span>
                      </div>

                      <div className="flex flex-shrink-0 items-center gap-4">
                        {task.due_date && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-muted-foreground text-xs">
                                {parseISO(new Date(task.due_date))}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Due Date: {format(new Date(task.due_date), "PPP")}
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-muted-foreground text-xs">
                              {formatDistanceToNow(new Date(task.updated_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Last Updated:{" "}
                            {format(new Date(task.updated_at), "PPP p")}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </li>
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
