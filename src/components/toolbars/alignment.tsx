"use client";

import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  CornerUpLeft,
} from "lucide-react";
import React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/toolbars/toolbar-provider";

type AlignmentValue = "left" | "center" | "right" | "justify" | "unset";

const alignmentOptions: {
  value: AlignmentValue;
  icon: React.ReactNode;
  label: string;
}[] = [
  {
    value: "left",
    icon: <AlignLeft className="h-4 w-4" />,
    label: "Align Left",
  },
  {
    value: "center",
    icon: <AlignCenter className="h-4 w-4" />,
    label: "Align Center",
  },
  {
    value: "right",
    icon: <AlignRight className="h-4 w-4" />,
    label: "Align Right",
  },
  {
    value: "justify",
    icon: <AlignJustify className="h-4 w-4" />,
    label: "Justify",
  },
  {
    value: "unset",
    icon: <CornerUpLeft className="h-4 w-4" />,
    label: "Reset Alignment",
  },
];

interface AlignmentToolbarProps extends ButtonProps {
  closeOnSelect?: boolean;
}

const AlignmentToolbar = React.forwardRef<
  HTMLButtonElement,
  AlignmentToolbarProps
>(({ className, onClick, children, closeOnSelect = true, ...props }, ref) => {
  const { editor } = useToolbar();
  const [open, setOpen] = React.useState(false);

  if (!editor) {
    return null;
  }

  const getCurrentAlignment = (): AlignmentValue => {
    if (editor.isActive({ textAlign: "left" })) return "left";
    if (editor.isActive({ textAlign: "center" })) return "center";
    if (editor.isActive({ textAlign: "right" })) return "right";
    if (editor.isActive({ textAlign: "justify" })) return "justify";
    return "left";
  };

  const currentAlignment = getCurrentAlignment();

  const getIcon = () => {
    const option = alignmentOptions.find(
      (opt) => opt.value === currentAlignment,
    );
    return option ? option.icon : alignmentOptions[0].icon;
  };

  const handleSelectAlignment = (alignment: AlignmentValue) => {
    if (alignment === "unset") {
      editor.chain().focus().unsetTextAlign().run();
    } else {
      editor.chain().focus().setTextAlign(alignment).run();
    }

    if (closeOnSelect) {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn("size-6", className)}
              ref={ref}
              {...props}
            >
              {children || getIcon()}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <span>Text Alignment</span>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="flex w-fit items-center gap-x-1 p-1">
        {alignmentOptions.map(({ value, icon, label }) => (
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-6",
                  value !== "unset" &&
                    editor.isActive({ textAlign: value }) &&
                    "bg-accent",
                )}
                onClick={() => handleSelectAlignment(value)}
              >
                {icon}
                <span className="sr-only">{label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>{label}</span>
            </TooltipContent>
          </Tooltip>
        ))}
      </PopoverContent>
    </Popover>
  );
});

AlignmentToolbar.displayName = "AlignmentToolbar";

export { AlignmentToolbar };
