import { validateUUID } from "@/lib/utils";
import { getTask } from "@/lib/api/tasks";
import { getCachedUser } from "@/lib/api/auth";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import TaskDetail from "@/components/tasks/task-detail";

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
    <Suspense fallback={<div>Loading...</div>}>
      <TaskDetail task={task} />
    </Suspense>
  );
}
