import NewTaskDialog from "@/components/tasks/new-task-dialog";
import { Task as TaskType } from "@/lib/types";
import Task from "./task";
import { format, isToday, isTomorrow } from "date-fns";

export default function Tasks({ tasks }: { tasks: TaskType[] }) {
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
      <header className="bg-sidebar sticky top-0 z-10 flex w-full items-center justify-between border-b p-2">
        <h3 className="font-mono font-medium">Tasks</h3>
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
