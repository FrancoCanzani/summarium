import { createClient } from "@/lib/supabase/server";
import { preloadNotes } from "@/lib/api/notes";
import { AppSidebar } from "@/components/app-sidebar";

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    preloadNotes(user.id);
  }

  return (
    <>
      <AppSidebar />
      <main className='flex-1'>{children}</main>
    </>
  );
}
