"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/utils";
import { TooltipProvider } from "./ui/tooltip";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          {/* useSearchParams() should be wrapped in a suspense boundary */}
          <NuqsAdapter>
            <Suspense>{children}</Suspense>
          </NuqsAdapter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
