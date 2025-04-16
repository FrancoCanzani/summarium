"use client";

import NotesSheet from "@/components/notes-sheet";
import { renderPriorityIcon, renderStatusIcon } from "@/components/tasks/task";
import { Note, Task } from "@/lib/types";
import { cn, getGreeting } from "@/lib/utils";
import { format, formatDistanceToNow, isToday, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";

interface AnimatedHomeContentProps {
  notes: Note[];
  allNotes: Note[];
  todayTasks: Task[];
  todayString: string;
}

export default function AnimatedHomeContent({
  notes,
  allNotes,
  todayTasks,
  todayString,
}: AnimatedHomeContentProps) {
  const greeting = getGreeting();

  const today = new Date();

  return (
    <div
      // a gradient depending the time of the day
      className={cn("mx-auto w-full p-4", {
        "bg-gradient-to-tr from-white via-white to-yellow-50/60":
          greeting.includes("morning"),
        "bg-gradient-to-tr from-white via-white to-orange-50":
          greeting.includes("afternoon"),
        "bg-gradient-to-tr from-white via-white to-blue-50/60":
          greeting.includes("evening"),
      })}
    >
      <div key="overview" className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.5 }}
          className="text-xl font-semibold"
        >
          {greeting}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground text-xl"
        >
          <p className="text-muted-foreground">
            Here&apos;s a quick overview for today,{" "}
            {format(today, "MMMM d, yyyy")}.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col gap-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-medium">Recent Notes</h2>
            <NotesSheet notes={allNotes}>
              <button className="text-zed block text-sm hover:underline md:hidden">
                View All Notes
              </button>
            </NotesSheet>
          </div>
          {notes.length === 0 ? (
            <div className="rounded-sm border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
              <p className="text-gray-500">No recent notes.</p>
              <Link
                href="/notes/new"
                className="text-sm text-blue-600 hover:underline"
              >
                Create your first note
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={`/notes/${note.id}`}
                    className="group block h-full"
                  >
                    <div className="hover:ring-border/50 hover:border-ring focus-visible:ring-border/50 focus-visible:border-ring bg-sidebar/10 hover:shadow-2xs flex h-full w-full flex-col items-start gap-2 rounded border p-2 text-sm transition-shadow duration-200 hover:ring-[2px] focus-visible:ring-[2px]">
                      <div className="flex w-full items-center justify-between">
                        <h3 className="truncate font-medium">
                          {note.title || "Untitled"}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(note.updated_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-3 text-xs">
                        {note.sanitized_content || "No content"}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        <motion.section
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div>
            <h2 className="mb-2 font-medium">Today&apos;s Focus</h2>
            <Link
              href={`/journal?day=${todayString}`}
              className="hover:ring-border/50 hover:border-ring focus-visible:ring-border/50 focus-visible:border-ring bg-sidebar/10 hover:shadow-2xs group flex w-full items-center justify-between gap-2 rounded border p-2 text-sm transition-shadow duration-200 hover:ring-[2px] focus-visible:ring-[2px]"
            >
              <div>
                <h3 className="font-medium">Today&apos;s Journal</h3>
                <p className="text-xs text-gray-500">
                  Write down your thoughts
                </p>
              </div>
              <MoveUpRight className="text-zed size-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-medium">Due Today</h2>
              <Link href="/tasks" className="text-zed text-sm hover:underline">
                View All Tasks
              </Link>
            </div>
            {todayTasks.length === 0 ? (
              <div className="shadow-2xs rounded border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                <p className="text-muted-foreground">
                  No tasks due today or overdue.
                </p>
                <Link
                  href="/tasks"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Manage your tasks
                </Link>
              </div>
            ) : (
              <div className="gap-2">
                {todayTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.5 + index * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={`/tasks/${task.id}`}
                      className="hover:ring-border/50 hover:border-ring focus-visible:ring-border/50 focus-visible:border-ring bg-sidebar/10 hover:shadow-2xs group flex w-full items-center justify-between gap-2 rounded border p-2 text-sm transition-shadow duration-200 hover:ring-[2px] focus-visible:ring-[2px]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex-shrink-0">
                          {renderStatusIcon(task.status)}
                        </div>
                        <div className="flex-shrink-0">
                          {renderPriorityIcon(task.priority)}
                        </div>
                        <span
                          className={cn(
                            "shrink truncate text-sm font-medium",
                            task.status === "complete" &&
                              "text-gray-400 line-through",
                          )}
                          title={task.title}
                        >
                          {task.title}
                        </span>
                      </div>
                      {task.due_date && (
                        <span className="flex-shrink-0 text-xs font-medium text-gray-500">
                          {isToday(parseISO(task.due_date.toString()))
                            ? `Today, ${format(parseISO(task.due_date.toString()), "h:mm a")}`
                            : format(
                                parseISO(task.due_date.toString()),
                                "MMM d",
                              )}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
