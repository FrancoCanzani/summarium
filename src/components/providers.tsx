"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* useSearchParams() should be wrapped in a suspense boundary */}
      <NuqsAdapter>
        <Suspense>{children}</Suspense>
      </NuqsAdapter>
    </SidebarProvider>
  );
}
