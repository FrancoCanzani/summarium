import { AppSidebar } from "@/components/app-sidebar"
import Providers from "@/components/providers"

export default function NotesLayout({ children }: { children: React.ReactNode }) {

  return (
    <Providers>
      <AppSidebar />
      <main className="flex-1">
        {children}
      </main>
    </Providers>
  )
}
