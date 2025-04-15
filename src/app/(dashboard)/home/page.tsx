import AnimatedHomeContent from "@/components/animated-home-page";
import { getCachedUser } from "@/lib/api/auth";
import { getNotes } from "@/lib/api/notes";
import { getTasks } from "@/lib/api/tasks";
import { format, isPast, isToday, parseISO } from "date-fns";
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
    redirect("/home");
  }
});

export default async function HomePage() {
  const { notes, tasks } = await getHomePageData();

  const lastSixNotes = notes.slice(0, 8);
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
    <AnimatedHomeContent
      notes={lastSixNotes}
      allNotes={notes}
      todayTasks={todayTasks}
      todayString={todayString}
    />
  );
}
