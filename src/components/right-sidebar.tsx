import { cn } from "@/lib/utils";
import React from "react";

type SidebarProps = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

const SIDEBAR_WIDTH = "20rem";

export function RightSidebar({ children, open, onOpenChange }: SidebarProps) {
  return (
    <div
      className={cn(
        "inset-y-0 z-10 hidden h-svh w-[20rem] translate-x-0 border-l bg-background transition-transform duration-200 ease-in-out",
        open ? "block" : "hidden"
      )}
      style={{ "--sidebar-width": SIDEBAR_WIDTH } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
