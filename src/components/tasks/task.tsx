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
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

export default function Task({ task }: { task: TaskType }) {
  return (
    <li
      key={task.id}
      className="hover:bg-accent/50 flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-100"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Checkbox />

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
                {format(new Date(task.due_date), "MMM d, h:mm a")}{" "}
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
    case "no-do":
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
