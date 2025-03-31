import { AppSidebar } from "@/components/app-sidebar";

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppSidebar />
      <main className="flex-1">{children}</main>
    </>
  );
}
