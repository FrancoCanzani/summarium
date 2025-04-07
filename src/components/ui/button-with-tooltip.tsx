import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, ButtonProps } from "@/components/ui/button";

interface ButtonWithTooltipProps extends ButtonProps {
  tooltipText: string;
}

const ButtonWithTooltip: React.FC<ButtonWithTooltipProps> = ({
  tooltipText,
  children,
  ...props
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button {...props}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
};

export default ButtonWithTooltip;
