import TaskDetail from "@/components/tasks/task-detail";
import { getCachedUser } from "@/lib/api/auth";
import { getTask } from "@/lib/api/tasks";
import { validateUUID } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;

  const result = validateUUID(rawId);

  if (!result.success) notFound();

  const id = result.data;

  const userPromise = getCachedUser();
  const taskPromise = getTask(id);

  const [{ data, error }, task] = await Promise.all([userPromise, taskPromise]);

  if (error || !data || !data.user) {
    redirect("/login");
  }

  if (!task || task.user_id !== data.user.id) notFound();

  return (
    <Suspense>
      <TaskDetail task={task} />
    </Suspense>
  );
}
