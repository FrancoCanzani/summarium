import { AppSidebar } from "@/components/app-sidebar";
import MobileMenu from "@/components/mobile-menu";

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full min-w-0 overflow-hidden">
      <AppSidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-10 md:pb-0">{children}</div>
        <MobileMenu />
      </main>
    </div>
  );
}
