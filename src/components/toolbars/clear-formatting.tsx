import { RemoveFormatting } from "lucide-react";
import React from "react";

import { useToolbar } from "@/components/toolbars/toolbar-provider";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const ClearFormattingToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const editor = useToolbar();

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-6",
              editor?.isActive("bold") && "bg-accent",
              className,
            )}
            onClick={(e) => {
              editor
                .chain()
                .focus()
                .clearNodes()
                .unsetAllMarks()
                .unsetTextAlign()
                .run();
              onClick?.(e);
            }}
            ref={ref}
            {...props}
          >
            {children || <RemoveFormatting className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Clear formatting</span>
        </TooltipContent>
      </Tooltip>
    );
  },
);

ClearFormattingToolbar.displayName = "ClearFormattingToolbar";

export { ClearFormattingToolbar };
