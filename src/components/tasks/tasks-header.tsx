import { Dispatch, SetStateAction, useTransition } from "react";
import NewTaskDialog from "@/components/tasks/new-task-dialog";
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
  CircleDashed,
  CircleDotDashed,
  CheckCircle2,
  CircleSlash,
  Ellipsis,
  Trash,
  CalendarClock,
  Loader2,
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
import { toast } from "sonner";
import { updateTask, deleteTask } from "@/lib/actions";
import {
  cn,
  calculatePostponedDate,
  getStatusLabel,
  getPriorityLabel,
} from "@/lib/utils";
import { Task } from "@/lib/types";

export default function TasksHeader({
  selected,
  setSelected,
  tasks,
}: {
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  tasks: Task[];
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useQueryState("status");
  const [priority, setPriority] = useQueryState("priority");
  const [view, setView] = useQueryState("view", { defaultValue: "all" });

  const handleBulkAction = (
    taskIds: string[],
    actionFn: (taskId: string) => Promise<{ success: boolean; error?: string }>,
    loadingMessage: string,
    successMessage: string,
    errorMessage: string,
  ) => {
    if (taskIds.length === 0) return;

    startTransition(async () => {
      const promise = Promise.all(taskIds.map(actionFn));

      toast.promise(promise, {
        loading: `${loadingMessage} (${taskIds.length})`,
        success: (results) => {
          const failedCount = results.filter((r) => !r.success).length;
          setSelected([]);
          if (failedCount > 0) {
            return `${
              taskIds.length - failedCount
            } tasks processed. ${failedCount} failed.`;
          }
          return `${successMessage} (${taskIds.length})`;
        },
        error: (err) => {
          console.error("Bulk action error:", err);
          return `${errorMessage} Please try again.`;
        },
      });
    });
  };

  const handleDeleteSelected = () => {
    handleBulkAction(
      selected,
      deleteTask,
      "Deleting tasks...",
      "Tasks deleted.",
      "Failed to delete tasks.",
    );
  };

  const handleChangePriority = (newPriority: string) => {
    const action = (taskId: string) =>
      updateTask(taskId, { priority: newPriority });
    handleBulkAction(
      selected,
      action,
      "Changing priority...",
      "Priority changed.",
      "Failed to change priority.",
    );
  };

  const handleChangeStatus = (newStatus: string) => {
    const action = (taskId: string) =>
      updateTask(taskId, { status: newStatus });
    handleBulkAction(
      selected,
      action,
      "Changing status...",
      "Status changed.",
      "Failed to change status.",
    );
  };

  const handlePostponeSelected = (duration: string) => {
    const action = (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      const newDueDate = calculatePostponedDate(task?.due_date, duration);
      return updateTask(taskId, { due_date: newDueDate });
    };
    handleBulkAction(
      selected,
      action,
      `Postponing tasks...`,
      "Tasks postponed.",
      "Failed to postpone tasks.",
    );
  };

  const renderSubMenuItem = (
    onClick: () => void,
    icon: React.ReactNode,
    label: string,
  ) => (
    <DropdownMenuItem onClick={onClick} disabled={isPending}>
      <span className="">{icon}</span>
      <span>{label}</span>
    </DropdownMenuItem>
  );

  return (
    <header className="bg-sidebar sticky top-0 z-10 flex w-full items-center justify-between border-b px-4 py-2">
      <h3 className="font-medium">Your Tasks</h3>
      <div className="flex items-center justify-end space-x-1">
        {selected.length > 0 && (
          <div className="flex h-7 w-full items-center justify-between rounded-sm border border-dashed text-sm">
            <span className="bg-background hover:bg-accent flex h-7 items-center justify-center rounded-l-sm border border-dashed p-2">
              {selected.length} Selected
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-background hover:bg-accent h-7 rounded-none border-y border-r border-dashed bg-none px-2"
                  aria-label="Task Actions"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Ellipsis className="size-3.5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-sm">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger disabled={isPending}>
                    <Circle className="mr-2 size-3.5" />
                    <span>Change Status</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {renderSubMenuItem(
                        () => handleChangeStatus("backlog"),
                        <CircleDashed className="size-3.5" />,
                        "Backlog",
                      )}
                      {renderSubMenuItem(
                        () => handleChangeStatus("todo"),
                        <Circle className="size-3.5" />,
                        "Todo",
                      )}
                      {renderSubMenuItem(
                        () => handleChangeStatus("in-progress"),
                        <CircleDotDashed className="size-3.5" />,
                        "In Progress",
                      )}
                      {renderSubMenuItem(
                        () => handleChangeStatus("complete"),
                        <CheckCircle2 className="size-3.5" />,
                        "Complete",
                      )}
                      {renderSubMenuItem(
                        () => handleChangeStatus("wont-do"),
                        <CircleSlash className="size-3.5" />,
                        "Won't Do",
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger disabled={isPending}>
                    <TriangleAlert className="mr-2 size-3.5" />
                    <span>Change Priority</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {renderSubMenuItem(
                        () => handleChangePriority("urgent"),
                        <TriangleAlert className="size-3.5" />,
                        "Urgent",
                      )}
                      {renderSubMenuItem(
                        () => handleChangePriority("high"),
                        <SignalHigh className="size-3.5" />,
                        "High",
                      )}
                      {renderSubMenuItem(
                        () => handleChangePriority("medium"),
                        <SignalMedium className="size-3.5" />,
                        "Medium",
                      )}
                      {renderSubMenuItem(
                        () => handleChangePriority("low"),
                        <SignalLow className="size-3.5" />,
                        "Low",
                      )}
                      {renderSubMenuItem(
                        () => handleChangePriority("no-priority"),
                        <X className="size-3.5" />,
                        "No Priority",
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger disabled={isPending}>
                    <CalendarClock className="mr-2 size-3.5" />
                    <span>Postpone</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => handlePostponeSelected("1 day")}
                        disabled={isPending}
                      >
                        <span>1 Day</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handlePostponeSelected("1 week")}
                        disabled={isPending}
                      >
                        <span>1 Week</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handlePostponeSelected("1 month")}
                        disabled={isPending}
                      >
                        <span>1 Month</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handlePostponeSelected("1 year")}
                        disabled={isPending}
                      >
                        <span>1 Year</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleDeleteSelected}
                  className="bg-red-100 hover:bg-red-200"
                >
                  <Trash className="size-3.5 text-black" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelected([])}
              disabled={isPending}
              className="bg-background hover:bg-accent h-7 rounded-r-sm border-y border-r border-dashed bg-none px-2"
              aria-label="Clear Selection"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        )}

        <Button
          variant={"outline"}
          size={"sm"}
          className={cn(
            "hidden items-center justify-center space-x-1.5 font-normal sm:flex",
            view === "all" && "bg-accent shadow-inner",
          )}
          onClick={() => setView("all")}
          disabled={isPending}
        >
          <Layers className="size-3" />
          All Tasks
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          className={cn(
            "hidden items-center justify-center space-x-1.5 font-normal sm:flex",
            view === "active" && "bg-accent shadow-inner",
          )}
          onClick={() => setView("active")}
          disabled={isPending}
        >
          <Circle className="size-3" />
          Active
        </Button>

        {status && (
          <Button
            variant={"outline"}
            size={"sm"}
            className="flex items-center justify-center font-normal"
            onClick={() => setStatus(null)}
            disabled={isPending}
          >
            <span>{getStatusLabel(status)}</span>
            <X className="size-3.5" />
          </Button>
        )}
        {priority && (
          <Button
            variant={"outline"}
            size={"sm"}
            className="flex items-center justify-center space-x-1 font-normal"
            onClick={() => setPriority(null)}
            disabled={isPending}
          >
            <span>{getPriorityLabel(priority)}</span>
            <X className="size-3.5" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-start space-x-1 font-normal"
              disabled={isPending}
            >
              <ListFilter className="size-3.5" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 rounded-sm">
            <DropdownMenuLabel>Filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={isPending}>
                  Status
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => setStatus("backlog")}
                      disabled={isPending}
                    >
                      <div className="flex w-full items-center justify-start space-x-2 text-xs">
                        <CircleDashed className="size-3.5" />
                        <span>Backlog</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatus("todo")}
                      disabled={isPending}
                    >
                      <div className="flex w-full items-center justify-start space-x-2 text-xs">
                        <Circle className="size-3.5" />
                        <span>Todo</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatus("in-progress")}
                      disabled={isPending}
                    >
                      <div className="flex w-full items-center justify-start space-x-2 text-xs">
                        <CircleDotDashed className="size-3.5" />
                        <span>In Progress</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatus("complete")}
                      disabled={isPending}
                    >
                      <div className="flex w-full items-center justify-start space-x-2 text-xs">
                        <CheckCircle2 className="size-3.5" />
                        <span>Complete</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatus("wont-do")}
                      disabled={isPending}
                    >
                      <div className="flex w-full items-center justify-start space-x-2 text-xs">
                        <CircleSlash className="size-3.5" />
                        <span>Won&apos;t do</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={isPending}>
                  Priority
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => setPriority("no-priority")}
                      disabled={isPending}
                    >
                      <div className="flex w-full items-center justify-start space-x-2 text-xs">
                        <X className="size-3.5" />
                        <span>No Priority</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPriority("urgent")}
                      disabled={isPending}
                    >
                      <div className="flex w-full items-center justify-start space-x-2 text-xs">
                        <TriangleAlert className="size-3.5" />
                        <span>Urgent</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPriority("high")}
                      disabled={isPending}
                    >
                      <div className="flex w-full items-center justify-start space-x-2 text-xs">
                        <SignalHigh className="size-3.5" />
                        <span>High</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPriority("medium")}
                      disabled={isPending}
                    >
                      <div className="flex w-full items-center justify-start space-x-2 text-xs">
                        <SignalMedium className="size-3.5" />
                        <span>Medium</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPriority("low")}
                      disabled={isPending}
                    >
                      <div className="flex w-full items-center justify-start space-x-2 text-xs">
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
              disabled={isPending}
            >
              Reset
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <NewTaskDialog />
      </div>
    </header>
  );
}
