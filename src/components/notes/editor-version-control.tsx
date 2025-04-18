import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { Note } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/core";
import { formatDistanceToNowStrict } from "date-fns";
import { diffLines } from "diff";
import localForage from "localforage";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import ButtonWithTooltip from "../ui/button-with-tooltip";
import { Separator } from "../ui/separator";

localForage.config({
  name: "summarium_notes_db",
  driver: localForage.INDEXEDDB,
  storeName: "note_versions",
});

export default function EditorVersionControl({ editor }: { editor: Editor }) {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [versions, setVersions] = useState<Note[]>([]);
  const [version, setVersion] = useQueryState("V");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchVersions = useCallback(async () => {
    if (!id) return;
    try {
      const keys = await localForage.keys();
      const versionEntries = await Promise.all(
        keys
          .filter((key) => key.startsWith(`${id}+`))
          .map(async (key) => (await localForage.getItem(key)) as Note),
      );

      const filteredVersions = versionEntries.filter(
        (v) => v && v.sanitized_content !== editor.getText(),
      );

      const sortedVersions = filteredVersions.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );

      setVersions(sortedVersions);
      if (!version && sortedVersions.length) {
        setVersion(sortedVersions[0].updated_at);
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
    }
  }, [id, editor, setVersion, version]);

  useEffect(() => {
    if (isSheetOpen) {
      fetchVersions();
    }
  }, [isSheetOpen, fetchVersions]);

  const selectedVersion = useMemo(
    () => versions.find((v) => v.updated_at === version),
    [versions, version],
  );

  const handleVersionClick = async (clickedVersion: Note) => {
    setVersion(clickedVersion.updated_at);
  };

  const handleRestoreVersion = () => {
    if (selectedVersion) {
      editor.commands.setContent(selectedVersion.content || "");
    }
  };

  const handlePreviousVersion = () => {
    if (selectedVersion) {
      const currentIndex = versions.findIndex(
        (v) => v.updated_at === selectedVersion.updated_at,
      );
      if (currentIndex > 0) {
        setVersion(versions[currentIndex - 1].updated_at);
      }
    }
  };

  const handleNextVersion = () => {
    if (selectedVersion) {
      const currentIndex = versions.findIndex(
        (v) => v.updated_at === selectedVersion.updated_at,
      );
      if (currentIndex < versions.length - 1) {
        setVersion(versions[currentIndex + 1].updated_at);
      }
    }
  };

  const renderDiff = () => {
    if (!selectedVersion) return null;
    const diffResult = diffLines(
      // Using line-level diff
      selectedVersion.sanitized_content || "",
      editor.getText(),
    );

    return diffResult.map((part, index) => (
      <div
        key={index}
        className={cn(
          part.added ? "bg-green-100" : "",
          part.removed ? "bg-red-100 line-through" : "",
          "rounded-sm px-1 py-0.5",
        )}
        style={{ whiteSpace: "pre-wrap" }} // Preserve line breaks
      >
        {part.value}
      </div>
    ));
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <ButtonWithTooltip
          tooltipText="Version control"
          variant="outline"
          size="xs"
          className="font-normal"
        >
          <Clock className="size-3" />
          <span>History</span>
        </ButtonWithTooltip>
      </SheetTrigger>
      <SheetContent
        className={cn(
          "flex flex-col rounded-l-sm text-sm",
          isMobile ? "h-[90%] w-full" : "h-full w-96",
        )}
        side={isMobile ? "bottom" : "right"}
      >
        <SheetHeader className="pb-0">
          <SheetTitle>Version control</SheetTitle>
          <SheetDescription>
            Select a version to view its content diff.
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center justify-between p-2">
          <Button
            variant="outline"
            size="sm"
            disabled={
              !selectedVersion ||
              versions.findIndex(
                (v) => v.updated_at === selectedVersion.updated_at,
              ) === 0
            }
            onClick={handlePreviousVersion}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={
              !selectedVersion ||
              versions.findIndex(
                (v) => v.updated_at === selectedVersion.updated_at,
              ) ===
                versions.length - 1
            }
            onClick={handleNextVersion}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 divide-y divide-dashed overflow-y-auto">
          {versions.map((version) => (
            <div
              key={`${version.id}-${version.updated_at}`}
              className={cn(
                "cursor-pointer p-2 hover:bg-gray-100",
                version.updated_at === selectedVersion?.updated_at &&
                  "bg-gray-100",
              )}
              onClick={() => handleVersionClick(version)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{version.title}</h3>
                <div className="flex items-center justify-end space-x-2 text-xs text-gray-500">
                  <span>{new Date(version.updated_at).toLocaleString()}</span>
                  <span>&middot;</span>
                  <span>
                    {formatDistanceToNowStrict(new Date(version.updated_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex-1 overflow-y-auto p-2">
          <p className="mb-2 font-semibold">Changes:</p>
          {renderDiff()}
          {!selectedVersion && (
            <p className="italic text-gray-500">
              Select a version to see the changes.
            </p>
          )}
        </div>

        <SheetFooter>
          <Button
            className="w-full"
            onClick={handleRestoreVersion}
            disabled={!selectedVersion}
          >
            Restore this version
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
