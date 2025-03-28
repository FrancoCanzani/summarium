"use client";

import { cn } from "@/lib/utils";
import React from "react";

type SidebarProps = {
  children: React.ReactNode;
  open: boolean;
};

const SIDEBAR_WIDTH = "20rem";

export function RightSidebar({ children, open }: SidebarProps) {
  return (
    <div
      className={cn(
        "bg-background hidden h-svh w-[20rem] overflow-hidden border-l transition-all duration-300 ease-in-out md:block",
        open ? "max-w-[20rem]" : "max-w-0",
      )}
      style={{ "--sidebar-width": SIDEBAR_WIDTH } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
