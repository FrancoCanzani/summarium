"use client";

import { deleteTaskActivity } from "@/lib/actions";
import { Activity } from "@/lib/types";
import { format } from "date-fns";
import { Circle } from "lucide-react";
import { useTransition } from "react";

export default function TaskDetailActivity({
  activity,
}: {
  activity: Activity;
}) {
  const [isPending, startTransition] = useTransition();

  const timeFormatted = format(new Date(activity.created_at), "h:mm a");

  return (
    <li className="group relative pb-2 pl-6">
      <Circle className="fill-border absolute left-0 top-1 h-2 w-2 stroke-none transition-colors duration-300 group-hover:fill-black" />

      <div className="space-y-0.5">
        <div className="text-muted-foreground flex w-full items-center justify-between text-xs">
          <span>{timeFormatted}</span>

          <button
            className="text-black hover:underline"
            onClick={() => {
              startTransition(() => {
                deleteTaskActivity(activity.id);
              });
            }}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
        <div className="text-xs">{activity.comment}</div>
      </div>
    </li>
  );
}
