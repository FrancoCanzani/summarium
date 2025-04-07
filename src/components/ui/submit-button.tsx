import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonProps } from "@/components/ui/button";

interface SubmitButtonProps extends Omit<ButtonProps, "asChild"> {
  loadingText?: string;
  icon?: React.ReactNode;
  showLoadingIcon?: boolean;
  defaultText: string;
}

export function SubmitButton({
  loadingText,
  defaultText,
  icon,
  showLoadingIcon = true,
  className,
  variant = "default",
  size = "sm",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || props.disabled}
      variant={variant}
      size={size}
      className={cn("relative", className)}
      {...props}
    >
      {pending && showLoadingIcon && (
        <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
      )}

      {!pending && icon && <span className="mr-2">{icon}</span>}

      {pending ? loadingText || defaultText : defaultText}
    </Button>
  );
}
