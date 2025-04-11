import { Task as TaskType } from "@/lib/types";
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
  Hourglass,
} from "lucide-react";
import { format, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Dispatch, SetStateAction } from "react";

export default function Task({
  task,
  selected,
  setSelected,
}: {
  task: TaskType;
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
}) {
  const isTaskOverdue = task.due_date && isPast(new Date(task.due_date));

  return (
    <li
      key={task.id}
      className={cn(
        "hover:bg-accent/50 flex items-center justify-between gap-4 px-3 py-2 transition-colors duration-300",
        {
          "opacity-40": task.status === "complete" || task.status === "wont-do",
        },
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Checkbox
          checked={selected.includes(task.id)}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelected([...selected, task.id]);
            } else {
              setSelected(selected.filter((id) => id !== task.id));
            }
          }}
        />
        {renderStatusIcon(task.status)}
        {renderPriorityIcon(task.priority)}
        <span
          className={cn("shrink-0 text-sm font-medium", {
            "line-through":
              task.status === "complete" || task.status === "wont-do",
          })}
          title={task.title}
        >
          {task.title}
        </span>
        <span className="text-muted-foreground shrink truncate text-xs">
          {task.description}
        </span>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        <div className="flex flex-shrink-0 items-center gap-2">
          {isTaskOverdue &&
            task.status !== "complete" &&
            task.status !== "wont-do" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Hourglass className="size-3.5 text-orange-500" />
                </TooltipTrigger>
                <TooltipContent>Overdue</TooltipContent>
              </Tooltip>
            )}
        </div>

        {task.due_date && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  "text-muted-foreground text-xs",
                  isTaskOverdue &&
                    task.status !== "complete" &&
                    task.status !== "wont-do" &&
                    "text-orange-600",
                )}
              >
                {format(new Date(task.due_date), "MMM d, h:mm a")}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              Due Date: {format(new Date(task.due_date), "MMM d, h:mm a")}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </li>
  );
}

export const renderStatusIcon = (status: string | undefined | null) => {
  const size = "size-3.5";
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

export const renderPriorityIcon = (priority: string | undefined | null) => {
  const size = "size-3.5";
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
