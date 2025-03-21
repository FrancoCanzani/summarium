import React from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BotMessageSquare } from "lucide-react";

export function AssistantToolbar({
  onClick,
  showAssistant,
}: {
  onClick?: (e: React.MouseEvent) => void;
  showAssistant: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-6 hidden md:flex", showAssistant && "bg-accent")}
          onClick={(e) => {
            onClick?.(e);
          }}
        >
          <BotMessageSquare className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Assistant</span>
        <span className="ml-1 text-xs text-gray-11">(cmd + a)</span>
      </TooltipContent>
    </Tooltip>
  );
}
