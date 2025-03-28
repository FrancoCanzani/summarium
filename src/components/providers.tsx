"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { AuthProvider } from "@/lib/context/auth-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          {/* useSearchParams() should be wrapped in a suspense boundary */}
          <NuqsAdapter>
            <Suspense>{children}</Suspense>
          </NuqsAdapter>
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
