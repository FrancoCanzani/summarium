import React from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Speech } from "lucide-react";

export function TranscribeToolbar({
  onClick,
  showTranscriber,
}: {
  onClick?: (e: React.MouseEvent) => void;
  showTranscriber: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-6", showTranscriber && "bg-accent")}
          onClick={(e) => {
            onClick?.(e);
          }}
        >
          <Speech className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Transcribe</span>
        <span className="text-gray-11 ml-1 text-xs">(cmd + t)</span>
      </TooltipContent>
    </Tooltip>
  );
}
