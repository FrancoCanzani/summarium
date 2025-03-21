import { LinkIcon, UnlinkIcon } from "lucide-react";
import React, { useCallback, useState } from "react";

import { useToolbar } from "@/components/toolbars/toolbar-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const LinkToolbar = React.forwardRef<HTMLButtonElement>((props, ref) => {
  const { editor } = useToolbar();
  const [url, setUrl] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const setLink = useCallback(() => {
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
    setIsOpen(false);
    setUrl("");
  }, [editor, url]);

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <Tooltip>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("size-6", editor.isActive("link") && "bg-accent")}
                ref={ref}
                {...props}
              >
                <LinkIcon className="h-4 w-4" />
                <span className="sr-only">Link</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <PopoverContent className="w-80 bg-background">
            <div className="flex flex-col space-y-2.5">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                className="h-9 text-sm"
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={setLink}
              >
                {editor.isActive("link") ? "Update Link" : "Add Link"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <TooltipContent>
          <span>Link</span>
        </TooltipContent>
      </Tooltip>
      {editor.isActive("link") && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={removeLink}
            >
              <UnlinkIcon className="h-4 w-4" />
              <span className="sr-only">Remove Link</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Remove Link</span>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
});

LinkToolbar.displayName = "LinkToolbar";
