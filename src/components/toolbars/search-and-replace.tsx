import { ArrowLeft, ArrowRight, Search, X, Replace } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { SearchAndReplaceStorage } from "@/lib/extensions/search-and-replace-extension";
import { useToolbar } from "@/components/toolbars/toolbar-provider";

export function SearchAndReplaceToolbar() {
  const editor = useToolbar();

  const [open, setOpen] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [checked, setChecked] = useState(false);

  const results = editor?.storage?.searchAndReplace
    .results as SearchAndReplaceStorage["results"];
  const selectedResult = editor?.storage?.searchAndReplace
    .selectedResult as SearchAndReplaceStorage["selectedResult"];

  const replace = () => editor?.chain().replace().run();
  const replaceAll = () => editor?.chain().replaceAll().run();
  const selectNext = () => editor?.chain().selectNextResult().run();
  const selectPrevious = () => editor?.chain().selectPreviousResult().run();

  useEffect(() => {
    editor?.chain().setSearchTerm(searchText).run();
  }, [searchText, editor]);

  useEffect(() => {
    editor?.chain().setReplaceTerm(replaceText).run();
  }, [replaceText, editor]);

  useEffect(() => {
    editor?.chain().setCaseSensitive(checked).run();
  }, [checked, editor]);

  useEffect(() => {
    if (!open) {
      setReplaceText("");
      setSearchText("");
      setReplacing(false);
    }
  }, [open]);

  return (
    <Popover open={open}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger disabled={!editor} asChild>
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                setOpen(!open);
              }}
              className={cn("font-normal")}
            >
              <Search className="size-3" />
              <span className="">Search</span>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <span>Search & Replace</span>
        </TooltipContent>
      </Tooltip>

      <PopoverContent
        align="end"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={() => {
          setOpen(false);
        }}
        className="bg-background relative flex w-[400px] px-2 py-1.5"
      >
        {!replacing ? (
          <div className={cn("relative flex w-full items-center gap-1.5")}>
            <Input
              value={searchText}
              className="mr-1.5 h-7 flex-1 px-1.5 text-sm"
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              placeholder="Search..."
            />
            <span className="text-xs">
              {results?.length === 0 ? selectedResult : selectedResult + 1}/
              {results?.length}
            </span>
            <Button onClick={selectPrevious} size="xs" variant="ghost">
              <ArrowLeft className="size-3" />
            </Button>
            <Button onClick={selectNext} size="xs" variant="ghost">
              <ArrowRight className="size-3" />
            </Button>
            <Separator orientation="vertical" className="mx-0.5 h-5" />
            <Button
              onClick={() => setReplacing(!replacing)}
              size="xs"
              variant="ghost"
            >
              <Replace className="size-3" />
            </Button>
            <Separator orientation="vertical" className="mx-0.5 h-5" />
            <Button
              onClick={() => {
                setOpen(false);
              }}
              size="xs"
              variant="ghost"
            >
              <X className="size-3" />
            </Button>
          </div>
        ) : (
          <div className={cn("relative w-full")}>
            <X
              onClick={() => {
                setOpen(false);
              }}
              className="absolute right-1 top-1.5 size-3"
            />
            <div className="flex w-full items-center gap-3">
              <Button
                size="xs"
                variant="ghost"
                onClick={() => {
                  setReplacing(false);
                }}
              >
                <ArrowLeft className="size-3" />
              </Button>
              <h2 className="text-sm font-medium">Search and replace</h2>
            </div>

            <div className="my-2 w-full">
              <div className="mb-3">
                <Label className="text-gray-11 mb-1 text-xs">Search</Label>
                <div className="mb-3 flex items-center justify-start gap-x-2 text-sm">
                  <Input
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                    placeholder="Search..."
                    className="h-7 rounded-sm px-1.5"
                  />
                  {results?.length === 0 ? selectedResult : selectedResult + 1}/
                  {results?.length}
                </div>
              </div>
              <div className="mb-2">
                <Label className="mb-1 text-xs">Replace with</Label>
                <Input
                  className="h-7 rounded-sm px-1.5"
                  value={replaceText}
                  onChange={(e) => {
                    setReplaceText(e.target.value);
                  }}
                  placeholder="Replace..."
                />
              </div>
              <div className="mt-3 flex items-center space-x-2">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(checked: boolean) => {
                    setChecked(checked);
                  }}
                  id="match_case"
                />
                <Label
                  htmlFor="match_case"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Match case
                </Label>
              </div>
            </div>

            <div className="actions mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button onClick={selectPrevious} size="xs" variant="secondary">
                  <ArrowLeft className="size-3" />
                </Button>
                <Button onClick={selectNext} size="xs" variant="secondary">
                  <ArrowRight className="size-3" />
                </Button>
              </div>

              <div className="main-actions flex items-center gap-2">
                <Button size="xs" variant="secondary" onClick={replaceAll}>
                  Replace All
                </Button>
                <Button onClick={replace} size="xs">
                  Replace
                </Button>
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
