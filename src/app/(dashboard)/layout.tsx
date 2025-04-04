import { AppSidebar } from "@/components/app-sidebar";
import MobileMenu from "@/components/mobile-menu";

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex w-full min-w-0">
      <AppSidebar />
      <main className="h-screen flex-1 flex-col justify-between">
        {children}
        <MobileMenu />
      </main>
    </div>
  );
}
