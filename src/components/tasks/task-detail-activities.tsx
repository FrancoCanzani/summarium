import { createTaskActivity } from "@/lib/actions";
import { getTaskActivities } from "@/lib/api/tasks";
import { Activity } from "@/lib/types";
import { format } from "date-fns";
import { Layers } from "lucide-react";
import { Label } from "../ui/label";
import { SubmitButton } from "../ui/submit-button";
import { Textarea } from "../ui/textarea";
import TaskDetailActivity from "./task-deltail-activity";

const groupActivitiesByDateRange = (activities: Activity[]) => {
  const groups: Record<string, Activity[]> = {};

  activities.forEach((activity) => {
    const date = new Date(activity.created_at);

    const dateKey = format(date, "MMMM d");

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(activity);
  });

  return Object.entries(groups);
};

export default async function TaskDetailActivities({
  taskId,
  userId,
}: {
  taskId: string;
  userId: string;
}) {
  const activities = await getTaskActivities(taskId, userId);
  const groupedActivities = groupActivitiesByDateRange(activities!);

  console.log(activities);

  async function handleFormAction(formData: FormData) {
    "use server";
    formData.append("task_id", taskId);
    const result = await createTaskActivity(formData);
    if (!result.success) {
      console.error(result.error);
    }
  }

  return (
    <div className="lg:bg-sidebar w-full flex-col p-2 lg:flex lg:h-full lg:w-1/4 lg:justify-between lg:border-l">
      <Label className="mb-4 text-sm font-medium">Activity</Label>

      <div className="thin-scrollbar flex flex-col overflow-y-auto lg:h-full">
        <div className="flex-1 pr-2">
          {activities && activities.length > 0 ? (
            <div className="space-y-6">
              {groupedActivities.map(([dateRange, items]) => (
                <div key={dateRange} className="space-y-1">
                  <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-medium">
                    <Layers className="size-4" />
                    <span>{dateRange}</span>
                  </div>

                  <div className="relative ml-1">
                    {/* Timeline line */}
                    <div className="bg-border/50 absolute bottom-0 left-1 top-0 w-px" />

                    <ul className="space-y-1">
                      {items.map((item) => (
                        <TaskDetailActivity key={item.id} activity={item} />
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-2 text-xs">
              No activity yet
            </div>
          )}
        </div>
      </div>
      <div className="border-border/50 mt-4 border-t pt-4">
        <form className="space-y-2" action={handleFormAction}>
          <Textarea
            name="comment"
            placeholder="Add a short follow up..."
            className="border-muted bg-background h-[90px] rounded-sm text-xs placeholder:text-xs"
            maxLength={1000}
          />
          <div className="flex justify-end">
            <SubmitButton
              showLoadingIcon={false}
              defaultText="Save"
              loadingText="Saving..."
              size="sm"
              variant="ghost"
              className="hover:bg-muted text-xs"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
