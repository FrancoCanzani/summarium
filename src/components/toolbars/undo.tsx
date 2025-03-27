import { Undo2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/toolbars/toolbar-provider";
import { forwardRef } from "react";

const UndoToolbar = forwardRef<HTMLButtonElement, ButtonProps>(
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
              editor?.chain().focus().undo().run();
              onClick?.(e);
            }}
            disabled={!editor?.can().chain().focus().undo().run()}
            ref={ref}
            {...props}
          >
            {children || <Undo2 className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Undo</span>
        </TooltipContent>
      </Tooltip>
    );
  },
);

UndoToolbar.displayName = "UndoToolbar";

export { UndoToolbar };
