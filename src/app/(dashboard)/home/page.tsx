import { Greeting } from "@/components/greeting";
import NotesSheet from "@/components/notes-sheet";
import { renderPriorityIcon, renderStatusIcon } from "@/components/tasks/task";
import { getCachedUser } from "@/lib/api/auth";
import { getNotes } from "@/lib/api/notes";
import { getTasks } from "@/lib/api/tasks";
import { cn } from "@/lib/utils";
import {
  format,
  formatDistanceToNow,
  isPast,
  isToday,
  parseISO,
} from "date-fns";
import { MoveUpRight, NotepadText, SquareCheckBig } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cache } from "react";

const getHomePageData = cache(async () => {
  const { data: userData, error: userError } = await getCachedUser();

  if (userError || !userData || !userData.user) {
    redirect("/login");
  }

  const userId = userData.user.id;

  try {
    const [notes, tasks] = await Promise.all([
      getNotes(userId),
      getTasks(userId),
    ]);
    return { notes, tasks };
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    redirect("/notes");
  }
});

export default async function HomePage() {
  const { notes, tasks } = await getHomePageData();

  const lastFourNotes = notes.slice(0, 6);
  const today = new Date();
  const todayString = format(today, "yyyy-MM-dd");

  const todayTasks = tasks.filter((task) => {
    const isCompleted = task.status === "complete" || task.status === "wont-do";
    if (isCompleted) return false;
    if (!task.due_date) return false;
    const dueDate = parseISO(task.due_date.toString());
    return isToday(dueDate) || isPast(dueDate);
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 pb-24">
      <header className="mb-10">
        <Greeting />
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between rounded-sm">
            <h2 className="text-xl font-medium">Recent Notes</h2>
            <NotesSheet notes={notes}>
              <button className="text-zed block text-sm hover:underline md:hidden">
                View All Notes
              </button>
            </NotesSheet>
          </div>
          {lastFourNotes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
              <NotepadText className="mx-auto mb-2 h-8 w-8 text-gray-400" />
              <p className="text-gray-500">No recent notes.</p>
              <Link
                href="/notes/new"
                // fix
                className="text-sm text-blue-600 hover:underline"
              >
                Create your first note
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {lastFourNotes.map((note) => (
                <Link
                  href={`/notes/${note.id}`}
                  key={note.id}
                  className="group"
                >
                  <div className="hover:ring-border/50 hover:border-ring focus-visible:outline-hidden focus-visible:ring-border/50 focus-visible:border-ring bg-sidebar group flex w-full flex-col items-start gap-4 rounded-sm border p-3 hover:ring-[3px] focus-visible:ring-[3px]">
                    <div className="mb-2 flex w-full items-center justify-between">
                      <h3 className="truncate font-medium">
                        {note.title || "Untitled"}
                      </h3>
                      <span className="text-xs">
                        {formatDistanceToNow(new Date(note.updated_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                      {note.sanitized_content || "No content"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-4 text-xl font-medium"> Today&apos;s Focus</h2>
            <Link
              href={`/journal?day=${todayString}`}
              className="hover:ring-border/50 hover:border-ring focus-visible:outline-hidden focus-visible:ring-border/50 focus-visible:border-ring bg-sidebar group flex w-full items-center justify-between gap-4 rounded-sm border p-3 hover:ring-[3px] focus-visible:ring-[3px]"
            >
              <div>
                <h3 className="font-medium">Today&apos;s Journal</h3>
                <p className="text-sm text-gray-500">
                  Write down your thoughts
                </p>
              </div>
              <MoveUpRight className="text-zed size-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-medium">Due Today</h2>
              <Link href="/tasks" className="text-zed text-sm hover:underline">
                View All Tasks
              </Link>
            </div>
            {todayTasks.length === 0 ? (
              <div className="rounded-sm border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                <SquareCheckBig className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-gray-500">No tasks due today or overdue.</p>
                <Link
                  href="/tasks"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Manage your tasks
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="hover:ring-border/50 hover:border-ring focus-visible:outline-hidden focus-visible:ring-border/50 focus-visible:border-ring bg-sidebar group flex w-full items-center justify-between gap-4 rounded-sm border p-3 hover:ring-[3px] focus-visible:ring-[3px]"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      {renderStatusIcon(task.status)}
                      {renderPriorityIcon(task.priority)}
                      <span
                        className={cn(
                          "shrink truncate text-sm font-medium",
                          task.status === "complete" && "line-through",
                        )}
                        title={task.title}
                      >
                        {task.title}
                      </span>
                    </div>
                    {task.due_date && (
                      <span className="flex-shrink-0 text-xs text-gray-500">
                        {isToday(parseISO(task.due_date.toString()))
                          ? `Today, ${format(parseISO(task.due_date.toString()), "h:mm a")}`
                          : format(parseISO(task.due_date.toString()), "MMM d")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
