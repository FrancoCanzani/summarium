import { BoldIcon } from "lucide-react";
import React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/toolbars/toolbar-provider";

const BoldToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              "hover:underline hover:underline-offset-4",
              editor?.isActive("bold") &&
                "underline underline-offset-4 font-medium",
              className
            )}
            onClick={(e) => {
              editor?.chain().focus().toggleBold().run();
              onClick?.(e);
            }}
            disabled={!editor?.can().chain().focus().toggleBold().run()}
            ref={ref}
            {...props}
          >
            Bold
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Bold</span>
          <span className="ml-1 text-xs text-gray-11">(cmd + b)</span>
        </TooltipContent>
      </Tooltip>
    );
  }
);

BoldToolbar.displayName = "BoldToolbar";

export { BoldToolbar };
