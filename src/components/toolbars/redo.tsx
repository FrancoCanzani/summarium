"use client";

import { Redo2 } from "lucide-react";
import { forwardRef } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/toolbars/toolbar-provider";

const RedoToolbar = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const editor = useToolbar();

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-6", className)}
            onClick={(e) => {
              editor?.chain().focus().redo().run();
              onClick?.(e);
            }}
            disabled={!editor?.can().chain().focus().redo().run()}
            ref={ref}
            {...props}
          >
            {children || <Redo2 className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Redo</span>
        </TooltipContent>
      </Tooltip>
    );
  },
);

RedoToolbar.displayName = "RedoToolbar";

export { RedoToolbar };
