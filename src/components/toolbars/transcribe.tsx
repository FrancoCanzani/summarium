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
          variant="outline"
          size="xs"
          className={cn("font-normal", showTranscriber && "bg-accent")}
          onClick={(e) => {
            onClick?.(e);
          }}
        >
          <Speech className="size-3" />
          <span>Transcribe</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Transcribe</span>
        <span className="ml-1 text-xs">(cmd + t)</span>
      </TooltipContent>
    </Tooltip>
  );
}
