import { getTasks } from "@/lib/api/tasks";
import { getCachedUser } from "@/lib/api/auth";
import { cache } from "react";
import { redirect } from "next/navigation";
import Tasks from "@/components/tasks/tasks";

const getCachedTasks = cache(async () => {
  const { data, error } = await getCachedUser();
  if (error || !data || !data.user) {
    redirect("/login");
  }
  return await getTasks(data.user.id);
});

export default async function TasksPage() {
  const tasks = await getCachedTasks();

  return <Tasks tasks={tasks} />;
}
