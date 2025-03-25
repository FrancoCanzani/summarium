"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Note } from "@/lib/types";
import { cn } from "@/lib/utils";
import { diffWords } from "diff";
import localForage from "localforage";
import { Clock } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToolbar } from "./toolbars/toolbar-provider";
import { Button } from "./ui/button";
import ButtonWithTooltip from "./ui/button-with-tooltip";
import { Separator } from "./ui/separator";

export default function EditorVersionControl() {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const { editor } = useToolbar();
  const [versions, setVersions] = useState<Note[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Note | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchVersions = async () => {
      try {
        localForage.config({
          name: "summarium_notes_db",
          driver: localForage.INDEXEDDB,
          storeName: "note_versions",
        });

        const keys = await localForage.keys();
        const versions: Note[] = [];

        for (const key of keys) {
          if (key.startsWith(`${id}+`)) {
            const version = (await localForage.getItem(key)) as Note;
            // avoid showing versions where the content is the same as the current editor content
            if (version && version.sanitized_content !== editor.getText()) {
              versions.push(version);
            }
          }
        }

        const sortedVersions = versions.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        );

        setVersions(sortedVersions);
      } catch (error) {
        console.error("Error fetching versions:", error);
      }
    };

    fetchVersions();
  }, [id]);

  const handleVersionClick = async (version: Note) => {
    try {
      localForage.config({
        name: "summarium_notes_db",
        driver: localForage.INDEXEDDB,
        storeName: "note_versions",
      });

      const key = `${id}+${version.updated_at}`;
      const note = (await localForage.getItem(key)) as Note | null;

      if (note) {
        setSelectedVersion(note);
      }
    } catch (error) {
      console.error("Error retrieving version content:", error);
      setSelectedVersion(null);
    }
  };

  const renderDiff = () => {
    if (!selectedVersion) return null;

    const diffResult = diffWords(
      selectedVersion.sanitized_content || "",
      editor.getText(),
    );

    return diffResult.map((part, index) => (
      <span
        key={index}
        className={cn(
          part.added ? "bg-green-100" : "",
          part.removed ? "bg-red-100 line-through" : "",
          "px-1",
        )}
      >
        {part.value}
      </span>
    ));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <ButtonWithTooltip
          tooltipText="Version control"
          variant="ghost"
          size="icon"
          className="size-6"
        >
          <Clock className="size-4" />
        </ButtonWithTooltip>
      </SheetTrigger>
      <SheetContent
        className={cn(
          "rounded-sm text-sm",
          isMobile ? "w-full h-[90%]" : "w-96 h-full",
        )}
        side={isMobile ? "bottom" : "right"}
      >
        <SheetHeader>
          <SheetTitle>Version control</SheetTitle>
          <SheetDescription>
            Select a version to view its content diff.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="overflow-y-scroll divide-y divide-dashed max-h-1/3">
            {versions.map((version: Note) => (
              <div
                key={`${version.id}+${version.updated_at}`}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleVersionClick(version)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{version.title}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(version.updated_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Separator />
          <div className="p-4 overflow-y-scroll border-r flex-1 max-h-2/3">
            {selectedVersion && renderDiff()}
          </div>
        </div>
        <SheetFooter>
          <Button
            onClick={() => {
              if (selectedVersion) {
                editor.commands.setContent(selectedVersion.content || "");
              }
            }}
          >
            Restore this version
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
